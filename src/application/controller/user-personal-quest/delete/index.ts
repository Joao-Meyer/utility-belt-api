import type { Controller } from '@domain/protocols';
import { messages } from '@i18n/index';
import { badRequest, errorLogger, ok, toNumber } from '@main/utils';
import { userPersonalQuestRepository } from '@repository/user-personal-quest';
import type { Request, Response } from 'express';

/**
 * DELETE /user-personal-quest/{id}
 * @summary Delete User Personal Quest
 * @tags User Personal Quest
 * @security BearerAuth
 * @param {integer} id.path.required
 * @return {DeleteResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {ForbiddenRequest} 403 - Forbidden response - application/json
 */
export const deleteUserPersonalQuestController: Controller =
  () =>
  async ({ lang, user, ...request }: Request, response: Response) => {
    try {
      await userPersonalQuestRepository.delete({
        personalQuestId: toNumber(request.params.id),
        userId: user.id
      });

      return ok({ payload: messages[lang].default.successfullyDeleted, lang, response });
    } catch (error) {
      errorLogger(error);
      return badRequest({ lang, response });
    }
  };
