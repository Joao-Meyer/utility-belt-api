import { finishedAt } from '@application/helper';
import { personalQuestFindParams } from '@data/search';
import type { Controller } from '@domain/protocols';
import {
  errorLogger,
  getCurrentDate,
  getDate,
  messageErrorResponse,
  ok,
  toNumber
} from '@main/utils';
import { personalQuestRepository } from '@repository/personal-quest';
import { userPersonalQuestRepository } from '@repository/user-personal-quest';
import { type Request, type Response } from 'express';
import { In } from 'typeorm';

interface Params {
  userIds?: number[];
  startDate?: string;
  endDate?: string;
}

/**
 * @typedef {object} FindPersonalQuestPayload
 * @property {array<quest>} content
 * @property {number} totalElements
 * @property {number} totalPages
 */

/**
 * @typedef {object} FindPersonalQuestResponse
 * @property {string} message
 * @property {string} status
 * @property {FindPersonalQuestPayload} payload
 */

/**
 * GET /personal-quest/user-progress
 * @summary Find User Progress Personal Quest
 * @tags Personal Quest
 * @security BearerAuth
 * @param {array<integer>} userIds.query
 * @param {string} startDate.query (Ex: 2024-01-01).
 * @param {string} endDate.query (Ex: 2024-01-01).
 * @return {FindPersonalQuestResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {ForbiddenRequest} 403 - Forbidden response - application/json
 */
export const findPersonalQuestUserProgressController: Controller =
  () =>
  async ({ lang, ...request }: Request, response: Response) => {
    try {
      const { endDate, startDate, userIds } = request.query as Params;

      const idsList: number[] = [];

      if (userIds) {
        if (Array.isArray(userIds) && userIds.length > 0) {
          userIds.forEach((item) => idsList.push(toNumber(item)));
        }

        if (typeof userIds === 'string') {
          idsList.push(toNumber(userIds));
        }
      }

      const quests = await personalQuestRepository.find({
        select: personalQuestFindParams,
        where: { finishedAt, userId: In(idsList) }
      });

      const day = getCurrentDate();

      let query = userPersonalQuestRepository
        .createQueryBuilder('upq')
        .leftJoinAndSelect('upq.user', 'user')
        .select([
          'upq.personalQuestId',
          'upq.day',
          'upq.finishedAt',
          'user.id',
          'user.name',
          'user.username'
        ])
        .where('upq.day BETWEEN :startDate AND :endDate', {
          startDate: getDate(startDate ?? day),
          endDate: getDate(endDate ?? day)
        });

      if (idsList) {
        query = query.andWhere('upq.userId IN (:...userIds)', { userIds: idsList });
      }

      const userPersonalQuests = await query.orderBy('upq.day', 'ASC').getRawMany();

      const questProgress = quests.map((quest) => {
        const usersCompleted = userPersonalQuests
          .filter((uq) => uq.upq_personal_quest_id === quest.id)
          .map((uq) => ({
            id: uq.user_id,
            name: uq.user_username,
            username: uq.user_username,
            day: uq.uq_day
          }));

        return {
          id: quest.id,
          name: quest.name,
          description: quest.description,
          completedByUsers: usersCompleted
        };
      });

      return ok({ payload: questProgress, lang, response });
    } catch (error) {
      errorLogger(error);

      return messageErrorResponse({ error, lang, response });
    }
  };
