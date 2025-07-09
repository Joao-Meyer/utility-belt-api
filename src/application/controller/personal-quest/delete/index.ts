import type { Controller } from '@domain/protocols';
import { messages } from '@i18n/index';
import { badRequest, errorLogger, ok, toNumber } from '@main/utils';
import { personalQuestRepository } from '@repository/personal-quest';
import type { Request, Response } from 'express';

/**
 * DELETE /personal-quest/{id}
 * @summary Delete Personal Quest
 * @tags Personal Quest
 * @security BearerAuth
 * @param {integer} id.path.required
 * @return {DeleteResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {ForbiddenRequest} 403 - Forbidden response - application/json
 */
export const deletePersonalQuestController: Controller =
  () =>
  async ({ lang, user, ...request }: Request, response: Response) => {
    try {
      await personalQuestRepository.update(
        { id: toNumber(request.params.id), userId: user.id },
        { finishedAt: new Date() }
      );

      return ok({ payload: messages[lang].default.successfullyDeleted, lang, response });
    } catch (error) {
      errorLogger(error);
      return badRequest({ lang, response });
    }
  };
