import { updateQuestSchema } from '@data/validation';
import type { Controller } from '@domain/protocols';
import { messages } from '@i18n/index';
import { errorLogger, messageErrorResponse, ok, toNumber } from '@main/utils';
import { personalQuestRepository } from '@repository/personal-quest';
import type { Request, Response } from 'express';

interface Body {
  name?: string;
  description?: string;
}

/**
 * @typedef {object} UpdatePersonalQuestBody
 * @property {string} name
 * @property {string} description
 */

/**
 * PUT /personal-quest/{id}
 * @summary Update Personal Quest
 * @tags Personal Quest
 * @security BearerAuth
 * @param {UpdatePersonalQuestBody} request.body
 * @param {integer} id.path.required
 * @return {UpdateResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {ForbiddenRequest} 403 - Forbidden response - application/json
 */
export const updatePersonalQuestController: Controller =
  () =>
  async ({ lang, user, ...request }: Request, response: Response) => {
    try {
      await updateQuestSchema.validate(request, { abortEarly: false });

      const { name, description } = request.body as Body;

      await personalQuestRepository.update(
        { id: toNumber(request.params.id), userId: user.id },
        { name, description }
      );

      return ok({ payload: messages[lang].default.successfullyUpdated, lang, response });
    } catch (error) {
      errorLogger(error);

      return messageErrorResponse({ error, lang, response });
    }
  };
