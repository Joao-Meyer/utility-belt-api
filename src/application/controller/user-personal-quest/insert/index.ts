import { insertUserQuestSchema } from '@data/validation';
import type { Controller } from '@domain/protocols';
import { ImageEntity } from '@entity/image';
import { UserPersonalQuestEntity } from '@entity/user-personal-quest';
import { DataSource } from '@infra/database';
import { created, errorLogger, getCurrentDate, messageErrorResponse } from '@main/utils';
import type { Request, Response } from 'express';

interface Body {
  questId: number;
  images?: string[];
}

/**
 * @typedef {object} InsertUserPersonalQuestBody
 * @property {integer} questId.required
 */

/**
 * POST /user-personal-quest
 * @summary Insert User Personal Quest
 * @tags User Personal Quest
 * @security BearerAuth
 * @param {InsertUserPersonalQuestBody} request.body.required - application/json
 * @return {CreatedResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 */
export const insertUserPersonalQuestController: Controller =
  () =>
  async ({ lang, user, ...request }: Request, response: Response) => {
    try {
      await insertUserQuestSchema.validate(request, { abortEarly: false });

      const { questId, images } = request.body as Body;

      const day = getCurrentDate();

      await DataSource.transaction(async (manager) => {
        const { identifiers } = await manager.insert(UserPersonalQuestEntity, {
          day,
          user: { id: user.id },
          personalQuest: { id: questId }
        });

        const imagesToCreate: unknown[] = [];

        images?.forEach((url) => {
          const id = identifiers[0].id;
          if (typeof id === 'number') imagesToCreate.push({ url, userQuest: { id } });
        });

        if (imagesToCreate?.length) {
          await manager.insert(ImageEntity, imagesToCreate as ImageEntity[]);
        }
      });

      return created({ lang, response });
    } catch (error) {
      errorLogger(error);

      return messageErrorResponse({ error, lang, response });
    }
  };
