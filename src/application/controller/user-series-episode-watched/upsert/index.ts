import { getWatchStatusOrder } from '@application/helper';
import { updateUserSeriesSchema } from '@data/validation';
import { WatchStatus } from '@domain/enum';
import type { Controller } from '@domain/protocols';
import { messages } from '@i18n/index';
import { errorLogger, messageErrorResponse, ok, toNumber } from '@main/utils';
import { userSeriesRepository } from '@repository/user-series';
import type { Request, Response } from 'express';

interface Body {
  favorite?: boolean;
  watchStatus?: WatchStatus;
  score?: number;
}

/**
 * @typedef {object} UpdateUserSeriesBody
 * @property {boolean} favorite
 * @property {string} watchStatus -enum:NOT_STARTED,WATCHING,WATCHED,DROPPED,WATCH_LATER
 * @property {number} score
 */

/**
 * POST /user-series/{seriesId}/episode-watched/{episodeId}
 * @summary User Series Episode Watched
 * @tags User Series
 * @security BearerAuth
 * @param {UpdateUserSeriesBody} request.body
 * @param {integer} seriesId.path.required
 * @param {integer} episodeId.path.required
 * @return {UpdateResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {ForbiddenRequest} 403 - Forbidden response - application/json
 */
export const upsertUserSeriesEpisodeWatchedController: Controller =
  () =>
  async ({ lang, ...request }: Request, response: Response) => {
    try {
      await updateUserSeriesSchema.validate(request, { abortEarly: false });

      const { favorite, score, watchStatus } = request.body as Body;

      await userSeriesRepository.upsert(
        {
          favorite,
          score,
          watchStatus,
          watchStatusOrder: watchStatus ? getWatchStatusOrder(watchStatus) : undefined,
          userId: request.user.id,
          seriesId: toNumber(request.params.seriesId)
        },
        {
          conflictPaths: ['userId', 'seriesId'],
          upsertType: 'on-conflict-do-update',
          skipUpdateIfNoValuesChanged: true
        }
      );

      return ok({ payload: messages[lang].default.successfullyUpdated, lang, response });
    } catch (error) {
      errorLogger(error);

      return messageErrorResponse({ error, lang, response });
    }
  };
