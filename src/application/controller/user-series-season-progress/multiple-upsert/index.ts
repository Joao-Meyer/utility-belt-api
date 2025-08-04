import { finishedAt, getUserSeries, getWatchStatusOrder } from '@application/helper';
import { updateMultipleUserSeriesSeasonProgressSchema } from '@data/validation';
import { WatchStatus } from '@domain/enum';
import type { Controller } from '@domain/protocols';
import { SeriesSeasonEpisodeEntity } from '@entity/series-season-episode';
import { UserSeriesEntity } from '@entity/user-series';
import { UserSeriesEpisodeWatchedEntity } from '@entity/user-series-episode-watched';
import { UserSeriesSeasonProgressEntity } from '@entity/user-series-season-progress';
import { messages } from '@i18n/index';
import { DataSource } from '@infra/database';
import { badRequest, errorLogger, messageErrorResponse, ok, toNumber } from '@main/utils';
import { seriesSeasonRepository } from '@repository/series-season';
import type { Request, Response } from 'express';
import { In } from 'typeorm';

interface Body {
  watch: boolean;
  seasons?: {
    id: number;
  }[];
  allSeason?: boolean;
}

/**
 * @typedef {object} MultipleUpdateUserSeriesSeasonProgressItemBody
 * @property {number} id.required
 */

/**
 * @typedef {object} MultipleUpdateUserSeriesSeasonProgressBody
 * @property {array<MultipleUpdateUserSeriesSeasonProgressItemBody>} seasons
 * @property {boolean} watch.required
 * @property {boolean} allSeason
 */

/**
 * POST /user-series/{seriesId}/season-progress
 * @summary Multiple User Series Season Progress
 * @tags User Series
 * @security BearerAuth
 * @param {MultipleUpdateUserSeriesSeasonProgressBody} request.body
 * @return {UpdateResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {ForbiddenRequest} 403 - Forbidden response - application/json
 */
export const upsertMultipleUserSeriesSeasonProgressController: Controller =
  () =>
  async ({ lang, user, ...request }: Request, response: Response) => {
    try {
      await updateMultipleUserSeriesSeasonProgressSchema.validate(request, { abortEarly: false });

      const { seasons, watch, allSeason } = request.body as Body;
      const seriesId = toNumber(request.params.seriesId);

      const seasonList =
        allSeason === true
          ? await seriesSeasonRepository.find({
              select: { id: true },
              where: { finishedAt, seriesId }
            })
          : (seasons ?? []);

      const userSeries = await getUserSeries({ seriesId, userId: user.id });

      if (!userSeries) return badRequest({ lang, response });

      const userSeriesSeason: Partial<UserSeriesSeasonProgressEntity>[] = seasonList?.map(
        ({ id }) => ({
          watchStatus: watch ? WatchStatus.WATCHED : WatchStatus.NONE,
          seriesSeasonId: id,
          userSeriesId: userSeries.id,
          userId: user.id
        })
      );

      await DataSource.transaction(async (manager) => {
        if (watch === false && userSeries.watchStatus === WatchStatus.WATCHED)
          await manager.update(
            UserSeriesEntity,
            { id: userSeries.id },
            {
              watchStatus: WatchStatus.WATCHING,
              watchStatusOrder: getWatchStatusOrder(WatchStatus.WATCHING)
            }
          );

        const { identifiers } = await manager.upsert(
          UserSeriesSeasonProgressEntity,
          userSeriesSeason,
          {
            conflictPaths: ['seriesSeasonId', 'userSeriesId'],
            upsertType: 'on-conflict-do-update',
            skipUpdateIfNoValuesChanged: false
          }
        );

        const seriesSeasonProgress = await manager.find(UserSeriesSeasonProgressEntity, {
          select: { id: true, seriesSeasonId: true },
          where: { id: In(identifiers?.map((item) => item.id)) }
        });

        const episodes = await manager.find(SeriesSeasonEpisodeEntity, {
          select: { id: true, seriesSeasonId: true },
          where: {
            seriesSeasonId: In(seriesSeasonProgress.map((item) => item.seriesSeasonId)),
            finishedAt
          }
        });

        const userSeriesSeasonEpisodes: Partial<UserSeriesEpisodeWatchedEntity>[] = [];

        seriesSeasonProgress?.forEach(({ id, seriesSeasonId }) => {
          const seasonEpisodes = episodes.filter((item) => item.seriesSeasonId === seriesSeasonId);

          seasonEpisodes.forEach((episodeItem) => {
            userSeriesSeasonEpisodes.push({
              watchStatus: watch ? WatchStatus.WATCHED : WatchStatus.NONE,
              seriesSeasonEpisodeId: episodeItem.id,
              userSeriesSeasonProgressId: id,
              userId: user.id
            });
          });
        });

        await manager.upsert(UserSeriesEpisodeWatchedEntity, userSeriesSeasonEpisodes, {
          conflictPaths: ['seriesSeasonEpisodeId', 'userSeriesSeasonProgressId'],
          upsertType: 'on-conflict-do-update',
          skipUpdateIfNoValuesChanged: true
        });
      });

      return ok({ payload: messages[lang].default.successfullyUpdated, lang, response });
    } catch (error) {
      errorLogger(error);

      return messageErrorResponse({ error, lang, response });
    }
  };
