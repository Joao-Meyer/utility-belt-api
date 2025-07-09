import { updateUserSchema } from '@data/validation';
import type { Controller } from '@domain/protocols';
import { messages } from '@i18n/index';
import { env } from '@main/config';
import { errorLogger, forbidden, messageErrorResponse, ok, toNumber } from '@main/utils';
import { userRepository } from '@repository/user';
import { hash } from 'bcrypt';
import type { Request, Response } from 'express';

interface Body {
  username?: string;
  name?: string;
  password?: string;
}

/**
 * @typedef {object} UpdateUserBody
 * @property {string} username
 * @property {string} name
 * @property {string} password
 */

/**
 * PUT /user/{id}
 * @summary Update User
 * @tags User
 * @security BearerAuth
 * @param {UpdateUserBody} request.body
 * @param {integer} id.path.required
 * @return {UpdateResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {ForbiddenRequest} 403 - Forbidden response - application/json
 */
export const updateUserController: Controller =
  () =>
  async ({ lang, user, ...request }: Request, response: Response) => {
    try {
      await updateUserSchema.validate(request, { abortEarly: false });

      const { name, password, username } = request.body as Body;

      if (user.id !== toNumber(request.params.id)) return forbidden({ lang, response });

      let newPassword: string | undefined = undefined;

      if (typeof password === 'string' && password.length >= 8)
        newPassword = await hash(password, env.HASH_SALT);

      await userRepository.update({ id: user.id }, { name, password: newPassword, username });

      return ok({ payload: messages[lang].default.successfullyUpdated, lang, response });
    } catch (error) {
      errorLogger(error);

      return messageErrorResponse({ error, lang, response });
    }
  };
