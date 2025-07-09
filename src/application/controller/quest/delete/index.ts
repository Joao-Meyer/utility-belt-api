import type { Controller } from '@domain/protocols';
import { messages } from '@i18n/index';
import { badRequest, errorLogger, ok, toNumber } from '@main/utils';
import { questRepository } from '@repository/quest';
import type { Request, Response } from 'express';

/**
 * DELETE /quest/{id}
 * @summary Delete Quest
 * @tags Quest
 * @security BearerAuth
 * @param {integer} id.path.required
 * @return {DeleteResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {ForbiddenRequest} 403 - Forbidden response - application/json
 */
export const deleteQuestController: Controller =
  () =>
  async ({ lang, user, ...request }: Request, response: Response) => {
    try {
      await questRepository.update(
        { id: toNumber(request.params.id) },
        { finishedAt: new Date(), deletedBy: { id: user.id } }
      );

      return ok({ payload: messages[lang].default.successfullyDeleted, lang, response });
    } catch (error) {
      errorLogger(error);
      return badRequest({ lang, response });
    }
  };
