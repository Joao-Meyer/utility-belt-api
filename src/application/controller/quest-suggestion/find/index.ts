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
 * GET /quest-suggestion
 * @summary Find Quest Suggestion
 * @tags Quest Suggestion
 * @security BearerAuth
 * @return {FindQuestResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {ForbiddenRequest} 403 - Forbidden response - application/json
 */
export const findQuestSuggestionController: Controller =
  () =>
  async ({ lang }: Request, response: Response) => {
    try {
      const data = await questSuggestionRepository
        .createQueryBuilder('qs')
        .leftJoinAndSelect('qs.createdBy', 'cb')
        .leftJoinAndSelect('qs.questSuggestionVoteList', 'qsvl')
        .leftJoinAndSelect('qsvl.user', 'u')
        .select([
          'qs.id',
          'qs.name',
          'qs.description',
          'qs.finishedAt',
          'cb.id',
          'cb.name',
          'cb.username',
          'u.id',
          'u.name',
          'u.username',

          'qsvl.id',
          'qsvl.vote'
        ])
        .where('qs.finishedAt IS NULL')
        .orderBy('qs.id', 'DESC')
        .getMany();

      const payload: unknown[] = [];

      data.forEach((item) => {
        const { questSuggestionVoteList, ...rest } = item;

        payload.push({
          ...rest,
          userVoteApproval: questSuggestionVoteList?.filter((item2) => item2.vote === true) ?? [],
          userVoteReApproval: questSuggestionVoteList?.filter((item2) => item2.vote === false) ?? []
        });
      });

      return ok({ payload, lang, response });
    } catch (error) {
      errorLogger(error);

      return messageErrorResponse({ error, lang, response });
    }
  };
