import type { Controller } from '@domain/protocols';
import { errorLogger, messageErrorResponse, ok } from '@main/utils';
import { questSuggestionRepository } from '@repository/quest-suggestion';
import type { Request, Response } from 'express';

/**
 * @typedef {object} FindQuestPayload
 * @property {array<Quest>} content
 * @property {number} totalElements
 * @property {number} totalPages
 */

/**
 * @typedef {object} FindQuestResponse
 * @property {string} message
 * @property {string} status
 * @property {FindQuestPayload} payload
 */

/**
 * GET /quest-suggestion/need-vote
 * @summary Find Quest Suggestion
 * @tags Quest Suggestion
 * @security BearerAuth
 * @return {FindQuestResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {ForbiddenRequest} 403 - Forbidden response - application/json
 */
export const findQuestSuggestionNeedVoteController: Controller =
  () =>
  async ({ lang, user }: Request, response: Response) => {
    try {
      const payload = await questSuggestionRepository
        .createQueryBuilder('qs')
        .leftJoinAndSelect('qs.createdBy', 'cb')
        .where('qs.finishedAt IS NULL')
        .andWhere(
          `NOT EXISTS (
          SELECT 1 FROM quest_suggestion_vote qsv 
          WHERE qsv.quest_suggestion_id = qs.id 
          AND qsv.user_id = :userId
        )`
        )
        .setParameter('userId', user.id)
        .orderBy('qs.id', 'DESC')
        .getMany();

      return ok({ payload, lang, response });
    } catch (error) {
      errorLogger(error);

      return messageErrorResponse({ error, lang, response });
    }
  };
