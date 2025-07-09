import { finishedAt } from '@application/helper';
import { userFindParams } from '@data/search';
import type { Controller } from '@domain/protocols';
import { messages } from '@i18n/index';
import { errorLogger, messageErrorResponse, notFound, ok, toNumber } from '@main/utils';
import { userRepository } from '@repository/user';
import type { Request, Response } from 'express';

/**
 * @typedef {object} FindOneUserResponse
 * @property {string} message
 * @property {string} status
 * @property {User} payload
 */

/**
 * GET /user/{id}
 * @summary Find one User
 * @tags User
 * @security BearerAuth
 * @param {integer} id.path.required
 * @return {FindOneUserResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {NotFoundRequest} 404 - Not found response - application/json
 */
export const findOneUserController: Controller =
  () =>
  async ({ lang, ...request }: Request, response: Response) => {
    try {
      const payload = await userRepository.findOne({
        select: userFindParams,
        where: { finishedAt, id: toNumber(request.params.id) }
      });

      if (payload === null) return notFound({ entity: messages[lang].entity.user, lang, response });

      return ok({ payload, lang, response });
    } catch (error) {
      errorLogger(error);

      return messageErrorResponse({ error, lang, response });
    }
  };
