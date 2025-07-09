import { finishedAt } from '@application/helper';
import { questFindParams } from '@data/search';
import type { Controller } from '@domain/protocols';
import { errorLogger, getCurrentDate, getDate, messageErrorResponse, ok } from '@main/utils';
import { questRepository } from '@repository/quest';
import { userRepository } from '@repository/user';
import { userQuestRepository } from '@repository/user-quest';
import { type Request, type Response } from 'express';

interface Params {
  userIds?: number[];
  startDate?: string;
  endDate?: string;
  perDay?: boolean;
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
 * GET /quest/user-progress
 * @summary Find User Progress Quest
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
export const findQuestUserProgressController: Controller =
  () =>
  async ({ lang, ...request }: Request, response: Response) => {
    try {
      const { endDate, startDate, userIds, perDay } = request.query as Params;

      const quests = await questRepository.find({
        select: questFindParams,
        where: { finishedAt },
        order: { order: 'ASC' }
      });

      const day = getCurrentDate();

      let query = userQuestRepository
        .createQueryBuilder('uq')
        .leftJoinAndSelect('uq.user', 'user')
        .select(['uq.questId', 'uq.day', 'uq.finishedAt', 'user.id', 'user.name', 'user.username'])
        .where('uq.day BETWEEN :startDate AND :endDate', {
          startDate: getDate(startDate ?? day),
          endDate: getDate(endDate ?? day)
        });

      if (userIds) {
        if (Array.isArray(userIds) && userIds.length > 0) {
          query = query.andWhere('uq.userId IN (:...userIds)', { userIds });
        }

        if (typeof userIds === 'string') {
          query = query.andWhere('uq.userId IN (:...userIds)', { userIds: [userIds] });
        }
      }

      const userQuests = await query.orderBy('uq.day', 'ASC').getMany();

      if (Boolean(perDay) === true) {
        const allUsers = await userRepository.find({
          select: ['id', 'name', 'username']
        });

        const userQuestCountPerDay = userQuests.reduce(
          (acc, uq) => {
            const { day: date, user } = uq;

            const day = String(date);

            if (!acc[day]) {
              acc[day] = {};
            }

            if (!acc[day][user.id]) {
              acc[day][user.id] = {
                id: user.id,
                name: user.name,
                username: user.username,
                totalQuestsCompleted: 0
              };
            }

            acc[day][user.id].totalQuestsCompleted += 1;

            return acc;
          },
          {} as Record<
            string,
            Record<
              number,
              { id: number; name: string; username: string; totalQuestsCompleted: number }
            >
          >
        );

        const formattedResult = Object.entries(userQuestCountPerDay).map(([day, users]) => {
          const usersWithZero = allUsers.map((user) => ({
            id: user.id,
            name: user.name,
            username: user.username,
            totalQuestsCompleted: users[user.id]?.totalQuestsCompleted || 0
          }));

          return { day, users: usersWithZero };
        });

        return ok({ payload: { users: allUsers, days: formattedResult }, lang, response });
      }

      const questProgress = quests.map((quest) => {
        const usersCompleted = userQuests
          .filter((uq) => uq.questId === quest.id)
          .map((uq) => ({
            id: uq.user.id,
            name: uq.user.name,
            username: uq.user.username,
            day: uq.day
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
