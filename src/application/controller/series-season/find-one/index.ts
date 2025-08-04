import { formatSeason } from '@application/helper';
import {
  seriesSeasonEpisodeFindParams,
  seriesSeasonFindParams,
  userSeriesEpisodeWatchedFindParams,
  userSeriesSeasonProgressFindParams
} from '@data/search';
import type { Controller } from '@domain/protocols';
import { messages } from '@i18n/index';
import { errorLogger, messageErrorResponse, notFound, ok, toNumber } from '@main/utils';
import { findParamsToSelect } from '@main/utils/find-params-to-select';
import { seriesSeasonRepository } from '@repository/series-season';
import type { Request, Response } from 'express';

/**
 * @typedef {object} FindOneSeriesSeasonResponse
 * @property {string} message
 * @property {string} status
 * @property {SeriesSeason} payload
 */

/**
 * GET /season/{id}
 * @summary Find one Series Season
 * @tags Series Season
 * @security BearerAuth
 * @param {integer} id.path.required
 * @return {FindOneSeriesSeasonResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {NotFoundRequest} 404 - Not found response - application/json
 */
export const findOneSeriesSeasonController: Controller =
  () =>
  async ({ lang, user, ...request }: Request, response: Response) => {
    try {
      const seasonId = toNumber(request.params.id);

      const findParamsQuery = findParamsToSelect([
        [seriesSeasonFindParams, 'ss'],
        [seriesSeasonEpisodeFindParams, 'sse'],
        [userSeriesSeasonProgressFindParams, 'ssp'],
        [userSeriesEpisodeWatchedFindParams, 'sew']
      ]);

      const payload = await seriesSeasonRepository
        .createQueryBuilder('ss')
        .select(findParamsQuery)
        .leftJoinAndSelect('ss.seriesSeasonEpisodeList', 'sse', 'sse.finishedAt IS NULL')
        .leftJoinAndSelect(
          'ss.userSeriesSeasonProgressList',
          'ssp',
          'ssp.userId = :userId AND ssp.finishedAt IS NULL',
          {
            userId: user.id
          }
        )
        .leftJoinAndSelect(
          'sse.userSeriesEpisodeWatchedList',
          'sew',
          'sew.userId = :userId AND sew.finishedAt IS NULL',
          {
            userId: user.id
          }
        )
        .where('ss.id = :id', { id: seasonId })
        .andWhere('ss.finishedAt IS NULL')
        .orderBy('sse.episodeNumber', 'ASC')
        .getOne();

      if (payload === null)
        return notFound({ entity: messages[lang].entity.seriesSeason, lang, response });

      return ok({ payload: formatSeason(payload), lang, response });
    } catch (error) {
      errorLogger(error);

      return messageErrorResponse({ error, lang, response });
    }
  };
