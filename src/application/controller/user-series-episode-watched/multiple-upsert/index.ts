import {
  getUserSeries,
  getUserSeriesSeasonProgress,
  getWatchStatusOrder
} from '@application/helper';
import { updateUserSeriesEpisodeWatchedSchema } from '@data/validation';
import { WatchStatus } from '@domain/enum';
import type { Controller } from '@domain/protocols';
import { UserSeriesEntity } from '@entity/user-series';
import { UserSeriesEpisodeWatchedEntity } from '@entity/user-series-episode-watched';
import { UserSeriesSeasonProgressEntity } from '@entity/user-series-season-progress';
import { messages } from '@i18n/index';
import { DataSource } from '@infra/database';
import { badRequest, errorLogger, messageErrorResponse, ok, toNumber } from '@main/utils';
import type { Request, Response } from 'express';

interface Body {
  watch?: boolean;
  score?: number;
  episodes: {
    id: number;
  }[];
}

/**
 * @typedef {object} UpdateUserSeriesEpisodeWatchedItemBody
 * @property {number} id.required
 */

/**
 * @typedef {object} UpdateUserSeriesEpisodeWatchedBody
 * @property {array<UpdateUserSeriesEpisodeWatchedItemBody>} episodes
 * @property {boolean} watch
 * @property {number} score
 */

/**
 * POST /user-series/{seriesId}/season/{seasonId}/episode-watched
 * @summary User Series Episode Watched
 * @tags User Series
 * @security BearerAuth
 * @param {UpdateUserSeriesEpisodeWatchedBody} request.body
 * @param {integer} seriesId.path.required
 * @param {integer} seasonId.path.required
 * @return {UpdateResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {ForbiddenRequest} 403 - Forbidden response - application/json
 */
export const upsertMultipleUserSeriesEpisodeWatchedController: Controller =
  () =>
  async ({ lang, user, ...request }: Request, response: Response) => {
    try {
      await updateUserSeriesEpisodeWatchedSchema.validate(request, { abortEarly: false });

      const { score, watch, episodes } = request.body as Body;

      const seriesId = toNumber(request.params.seriesId);
      const seasonId = toNumber(request.params.seasonId);

      const userSeries = await getUserSeries({ seriesId, userId: user.id });

      if (!userSeries) return badRequest({ lang, response });

      const userSeriesSeasonProgress = await getUserSeriesSeasonProgress({
        seriesSeasonId: seasonId,
        userSeriesId: userSeries.id,
        userId: user.id
      });

      if (!userSeriesSeasonProgress) return badRequest({ lang, response });

      const userSeriesSeasonEpisodes: Partial<UserSeriesEpisodeWatchedEntity>[] = episodes.map(
        (episodeItem) => ({
          score,
          watchStatus:
            typeof watch === 'undefined'
              ? undefined
              : watch
                ? WatchStatus.WATCHED
                : WatchStatus.NONE,
          seriesSeasonEpisodeId: episodeItem.id,
          userSeriesSeasonProgressId: userSeriesSeasonProgress.id,
          userId: user.id
        })
      );

      await DataSource.transaction(async (manager) => {
        await manager.upsert(UserSeriesEpisodeWatchedEntity, userSeriesSeasonEpisodes, {
          conflictPaths: ['seriesSeasonEpisodeId', 'userSeriesSeasonProgressId'],
          upsertType: 'on-conflict-do-update',
          skipUpdateIfNoValuesChanged: true
        });

        if (watch === false && userSeries.watchStatus === WatchStatus.WATCHED)
          await manager.update(
            UserSeriesEntity,
            { id: userSeries.id },
            {
              watchStatus: WatchStatus.WATCHING,
              watchStatusOrder: getWatchStatusOrder(WatchStatus.WATCHING)
            }
          );
        else if (watch === true && userSeries.watchStatus === WatchStatus.NONE)
          await manager.update(
            UserSeriesEntity,
            { id: userSeries.id },
            {
              watchStatus: WatchStatus.WATCHING,
              watchStatusOrder: getWatchStatusOrder(WatchStatus.WATCHING)
            }
          );

        if (watch === false && userSeriesSeasonProgress.watchStatus === WatchStatus.WATCHED)
          await manager.update(
            UserSeriesSeasonProgressEntity,
            { id: userSeriesSeasonProgress.id },
            {
              watchStatus: WatchStatus.NONE
            }
          );
      });

      return ok({ payload: messages[lang].default.successfullyUpdated, lang, response });
    } catch (error) {
      errorLogger(error);

      return messageErrorResponse({ error, lang, response });
    }
  };
