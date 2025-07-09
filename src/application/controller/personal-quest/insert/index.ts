import { insertQuestSchema } from '@data/validation';
import type { Controller } from '@domain/protocols';
import { created, errorLogger, messageErrorResponse } from '@main/utils';
import { personalQuestRepository } from '@repository/personal-quest';
import type { Request, Response } from 'express';

interface Body {
  name: string;
  description?: string;
}

/**
 * @typedef {object} InsertPersonalQuestBody
 * @property {string} name.required
 * @property {string} description
 */

/**
 * POST /personal-quest
 * @summary Insert Personal Quest
 * @tags Personal Quest
 * @security BearerAuth
 * @param {InsertPersonalQuestBody} request.body.required - application/json
 * @return {CreatedResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 */
export const insertPersonalQuestController: Controller =
  () =>
  async ({ lang, user, ...request }: Request, response: Response) => {
    try {
      await insertQuestSchema.validate(request, { abortEarly: false });

      const { name, description } = request.body as Body;

      await personalQuestRepository.insert({
        name,
        description,
        user: { id: user.id }
      });

      return created({ lang, response });
    } catch (error) {
      errorLogger(error);

      return messageErrorResponse({ error, lang, response });
    }
  };
