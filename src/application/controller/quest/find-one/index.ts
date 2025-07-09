import { finishedAt } from '@application/helper';
import { questFindParams } from '@data/search';
import type { Controller } from '@domain/protocols';
import { messages } from '@i18n/index';
import { errorLogger, messageErrorResponse, notFound, ok, toNumber } from '@main/utils';
import { questRepository } from '@repository/quest';
import type { Request, Response } from 'express';

/**
 * @typedef {object} FindOneQuestResponse
 * @property {string} message
 * @property {string} status
 * @property {Quest} payload
 */

/**
 * GET /quest/{id}
 * @summary Find One Quest
 * @tags Quest
 * @security BearerAuth
 * @param {integer} id.path.required
 * @return {FindOneQuestResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {NotFoundRequest} 404 - Not found response - application/json
 */
export const findOneQuestController: Controller =
  () =>
  async ({ lang, ...request }: Request, response: Response) => {
    try {
      const payload = await questRepository.findOne({
        select: questFindParams,
        where: { id: toNumber(request.params.id), finishedAt }
      });

      if (payload === null)
        return notFound({ entity: messages[lang].entity.quest, lang, response });

      return ok({ payload, lang, response });
    } catch (error) {
      errorLogger(error);

      return messageErrorResponse({ error, lang, response });
    }
  };
