import { getWatchStatusOrder } from '@application/helper';
import { updateMultipleUserSeriesSchema } from '@data/validation';
import { WatchStatus } from '@domain/enum';
import type { Controller } from '@domain/protocols';
import { UserSeriesEntity } from '@entity/user-series';
import { messages } from '@i18n/index';
import { errorLogger, messageErrorResponse, ok } from '@main/utils';
import { userSeriesRepository } from '@repository/user-series';
import type { Request, Response } from 'express';

interface Body {
  series: {
    id: number;
    favorite?: boolean;
    watchStatus?: WatchStatus;
    score?: number;
  }[];
}

/**
 * @typedef {object} MultipleUpdateUserSeriesBody
 * @property {array<UpdateUserSeriesBody>} series
 */

/**
 * POST /user-series
 * @summary Multiple User Series
 * @tags User Series
 * @security BearerAuth
 * @param {MultipleUpdateUserSeriesBody} request.body
 * @return {UpdateResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {ForbiddenRequest} 403 - Forbidden response - application/json
 */
export const upsertMultipleUserSeriesController: Controller =
  () =>
  async ({ lang, ...request }: Request, response: Response) => {
    try {
      await updateMultipleUserSeriesSchema.validate(request, { abortEarly: false });

      const { series } = request.body as Body;

      const userSeries: Partial<UserSeriesEntity>[] = series?.map(
        ({ id, favorite, score, watchStatus }) => ({
          favorite,
          score,
          watchStatus,
          watchStatusOrder: watchStatus ? getWatchStatusOrder(watchStatus) : undefined,
          userId: request.user.id,
          seriesId: id
        })
      );

      if (userSeries?.length)
        await userSeriesRepository.upsert(userSeries, {
          conflictPaths: ['userId', 'seriesId'],
          upsertType: 'on-conflict-do-update',
          skipUpdateIfNoValuesChanged: true
        });

      return ok({ payload: messages[lang].default.successfullyUpdated, lang, response });
    } catch (error) {
      errorLogger(error);

      return messageErrorResponse({ error, lang, response });
    }
  };
