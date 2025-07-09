import { insertUserQuestSchema } from '@data/validation';
import type { Controller } from '@domain/protocols';
import { created, errorLogger, messageErrorResponse } from '@main/utils';
import { userQuestRepository } from '@repository/user-quest';
import type { Request, Response } from 'express';

interface Body {
  questId: number;
  day: string;
  images?: string[];
}

/**
 * @typedef {object} InsertUserQuestBody
 * @property {integer} questId.required
 */

/**
 * POST /user-quest
 * @summary Insert User Quest
 * @tags User Quest
 * @security BearerAuth
 * @param {InsertUserQuestBody} request.body.required - application/json
 * @return {CreatedResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 */
export const insertUserQuestController: Controller =
  () =>
  async ({ lang, user, ...request }: Request, response: Response) => {
    try {
      await insertUserQuestSchema.validate(request, { abortEarly: false });

      const { questId, day } = request.body as Body;

      await userQuestRepository.insert({
        day,
        user: { id: user.id },
        quest: { id: questId }
      });

      return created({ lang, response });
    } catch (error) {
      errorLogger(error);

      return messageErrorResponse({ error, lang, response });
    }
  };
