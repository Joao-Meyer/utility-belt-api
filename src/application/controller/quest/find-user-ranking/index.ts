import type { Controller } from '@domain/protocols';
import { errorLogger, messageErrorResponse, ok, toNumber } from '@main/utils';
import { userRepository } from '@repository/user';
import { type Request, type Response } from 'express';

interface Params {
  userIds?: number[];
}

/**
 * @typedef {object} FindQuestPayload
 * @property {array<quest>} content
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
 * GET /quest/user-ranking
 * @summary Find User Ranking Quest
 * @tags Quest
 * @security BearerAuth
 * @param {array<integer>} userIds.query
 * @param {string} startDate.query (Ex: 2024-01-01).
 * @param {string} endDate.query (Ex: 2024-01-01).
 * @return {FindQuestResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {ForbiddenRequest} 403 - Forbidden response - application/json
 */
export const findQuestUserRankingController: Controller =
  () =>
  async ({ lang, ...request }: Request, response: Response) => {
    try {
      const { userIds } = request.query as Params;

      const idsList: number[] = [];

      if (userIds) {
        if (Array.isArray(userIds) && userIds.length > 0) {
          userIds.forEach((item) => idsList.push(toNumber(item)));
        }

        if (typeof userIds === 'string') {
          idsList.push(toNumber(userIds));
        }
      }

      let query = userRepository
        .createQueryBuilder('u')
        .select([
          'u.id',
          'u.name',
          'u.username',
          'COALESCE(COUNT(DISTINCT uql.id), 0) AS questcount',
          'COALESCE(COUNT(DISTINCT udl.id), 0) AS daycount'
        ])
        .leftJoin('u.userQuestList', 'uql')
        .leftJoin('u.userDayList', 'udl')
        .where('u.finishedAt IS NULL')
        .groupBy('u.id, u.name, u.username')
        .orderBy('questcount', 'DESC');

      if (idsList?.length) {
        query = query.andWhere('u.id IN (:...ids)', { ids: idsList });
      }

      const data = await query.getRawMany();

      return ok({
        payload: data.map((item) => ({
          id: item.u_id,
          name: item.u_name,
          username: item.u_username,
          questCount: item.questcount,
          dayCount: item.daycount
        })),
        lang,
        response
      });
    } catch (error) {
      errorLogger(error);

      return messageErrorResponse({ error, lang, response });
    }
  };
