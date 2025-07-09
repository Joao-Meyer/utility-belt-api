import { insertQuestSchema } from '@data/validation';
import type { Controller } from '@domain/protocols';
import { created, errorLogger, messageErrorResponse } from '@main/utils';
import { questSuggestionRepository } from '@repository/quest-suggestion';
import type { Request, Response } from 'express';

interface Body {
  name: string;
  description?: string;
}

/**
 * @typedef {object} InsertQuestBody
 * @property {string} name.required
 * @property {string} description
 */

/**
 * POST /quest-suggestion
 * @summary Insert Quest Suggestion
 * @tags Quest Suggestion
 * @security BearerAuth
 * @param {InsertQuestBody} request.body.required - application/json
 * @return {CreatedResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 */
export const insertQuestSuggestionController: Controller =
  () =>
  async ({ lang, user, ...request }: Request, response: Response) => {
    try {
      await insertQuestSchema.validate(request, { abortEarly: false });

      const { name, description } = request.body as Body;

      await questSuggestionRepository.insert({
        name,
        description,
        createdBy: { id: user.id }
      });

      return created({ lang, response });
    } catch (error) {
      errorLogger(error);

      return messageErrorResponse({ error, lang, response });
    }
  };
