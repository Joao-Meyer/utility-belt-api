import { finishedAt } from '@application/helper';
import type { Controller } from '@domain/protocols';
import { QuestEntity } from '@entity/quest';
import { UserDayEntity } from '@entity/user-day';
import { UserQuestEntity } from '@entity/user-quest';
import { messages } from '@i18n/index';
import { DataSource } from '@infra/database';
import { badRequest, errorLogger, getDate, ok, toNumber } from '@main/utils';
import type { Request, Response } from 'express';

/**
 * DELETE /user-quest/{id}/{day}
 * @summary Delete User Quest
 * @tags User Quest
 * @security BearerAuth
 * @param {integer} id.path.required
 * @param {string} day.path.required
 * @return {DeleteResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {ForbiddenRequest} 403 - Forbidden response - application/json
 */
export const deleteUserQuestController: Controller =
  () =>
  async ({ lang, user, ...request }: Request, response: Response) => {
    try {
      const questId = toNumber(request.params.id);
      const day = getDate(request.params.day) as unknown as Date;

      await DataSource.transaction(async (manager) => {
        await manager.delete(UserQuestEntity, {
          day,
          questId,
          userId: user.id
        });

        const quest = await manager.findOne(QuestEntity, {
          select: { id: true, countToDay: true },
          where: { finishedAt, id: questId }
        });

        if (quest?.countToDay === true) {
          await manager.delete(UserDayEntity, { day, userId: user.id });
        }
      });

      return ok({ payload: messages[lang].default.successfullyDeleted, lang, response });
    } catch (error) {
      errorLogger(error);
      return badRequest({ lang, response });
    }
  };
