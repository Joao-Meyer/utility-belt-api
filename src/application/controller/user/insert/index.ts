import { insertUserSchema } from '@data/validation';
import type { Controller } from '@domain/protocols';
import { messages } from '@i18n/index';
import { env } from '@main/config';
import { badRequest, created, errorLogger, messageErrorResponse } from '@main/utils';
import { userRepository } from '@repository/user';
import { hash } from 'bcrypt';
import type { Request, Response } from 'express';

interface Body {
  username: string;
  name: string;
  password: string;
  apiKey: string;
}

/**
 * @typedef {object} InsertUserBody
 * @property {string} username.required
 * @property {string} name.required
 * @property {string} password.required
 * @property {string} apiKey.required
 */

/**
 * POST /user
 * @summary Insert User
 * @tags User
 * @param {InsertUserBody} request.body.required - application/json
 * @return {CreatedResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 */
export const insertUserController: Controller =
  () =>
  async ({ lang, ...request }: Request, response: Response) => {
    try {
      await insertUserSchema.validate(request, { abortEarly: false });

      const { name, password, username, apiKey } = request.body as Body;

      if (apiKey !== env.REGISTER_USER_KEY)
        return badRequest({ lang, response, message: messages[lang].error.invalidKey });

      const hashPassword = await hash(password, env.HASH_SALT);

      await userRepository.insert({ name, password: hashPassword, username });

      return created({ response, lang });
    } catch (error) {
      errorLogger(error);

      return messageErrorResponse({ error, lang, response });
    }
  };
