import { finishedAt } from '@application/helper';
import { personalQuestFindParams } from '@data/search';
import type { Controller } from '@domain/protocols';
import { messages } from '@i18n/index';
import { errorLogger, messageErrorResponse, notFound, ok, toNumber } from '@main/utils';
import { personalQuestRepository } from '@repository/personal-quest';
import type { Request, Response } from 'express';

/**
 * @typedef {object} FindOnePersonalQuestResponse
 * @property {string} message
 * @property {string} status
 * @property {PersonalQuest} payload
 */

/**
 * GET /personal-quest/{id}
 * @summary Find One Personal Quest
 * @tags Personal Quest
 * @security BearerAuth
 * @param {integer} id.path.required
 * @return {FindOnePersonalQuestResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {NotFoundRequest} 404 - Not found response - application/json
 */
export const findOnePersonalQuestController: Controller =
  () =>
  async ({ lang, ...request }: Request, response: Response) => {
    try {
      const payload = await personalQuestRepository.findOne({
        select: personalQuestFindParams,
        where: { id: toNumber(request.params.id), finishedAt }
      });

      if (payload === null)
        return notFound({ entity: messages[lang].entity.personalQuest, lang, response });

      return ok({ payload, lang, response });
    } catch (error) {
      errorLogger(error);

      return messageErrorResponse({ error, lang, response });
    }
  };
