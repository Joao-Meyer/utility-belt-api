import { finishedAt } from '@application/helper';
import { userFindParams } from '@data/search';
import type { Controller } from '@domain/protocols';
import { messages } from '@i18n/index';
import { badRequest, errorLogger, generateToken, messageErrorResponse, ok } from '@main/utils';
import { userRepository } from '@repository/user';
import { compare } from 'bcrypt';
import type { Request, Response } from 'express';

interface Body {
  username: string;
  password: string;
}

/**
 * @typedef {object} UserLoginBody
 * @property {string} username.required
 * @property {string} password.required
 */

/**
 * @typedef {object} UserLoginPayload
 * @property {string} accessToken.required
 * @property {User} user.required
 */

/**
 * @typedef {object} UserLoginResponse
 * @property {string} message
 * @property {string} status
 * @property {UserLoginPayload} payload
 */

/**
 * POST /auth/login
 * @summary User Login
 * @tags A Auth
 * @param {UserLoginBody} request.body.required - application/json
 * @return {UserLoginResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 */
export const userLoginController: Controller =
  () =>
  async ({ lang, ...request }: Request, response: Response) => {
    try {
      const { username, password } = request.body as Body;

      if (!username || !password)
        return badRequest({ message: messages[lang].error.badCredentials, lang, response });

      const user = await userRepository.findOne({
        select: {
          ...userFindParams,
          password: true
        },
        where: { username, finishedAt }
      });

      if (user === null)
        return badRequest({ message: messages[lang].error.badLoginCredentials, lang, response });

      const isCorrectPassword = await compare(password, user.password);

      if (!isCorrectPassword)
        return badRequest({ message: messages[lang].error.badLoginCredentials, lang, response });

      const { accessToken } = generateToken({
        id: user.id,
        username: user.username
      });

      return ok({
        payload: {
          accessToken,
          user: {
            id: user.id,
            name: user.name,
            username: user.username,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
          }
        },
        lang,
        response
      });
    } catch (error) {
      errorLogger(error);

      return messageErrorResponse({ error, lang, response });
    }
  };
