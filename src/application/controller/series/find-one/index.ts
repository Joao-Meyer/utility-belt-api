import { formatSeries } from '@application/helper';
import {
  categoryFindParams,
  seriesFindParams,
  seriesSeasonFindParams,
  tagFindParams,
  themeFindParams,
  userSeriesFindParams,
  userSeriesSeasonProgressFindParams
} from '@data/search';
import type { Controller } from '@domain/protocols';
import { messages } from '@i18n/index';
import { errorLogger, messageErrorResponse, notFound, ok, toNumber } from '@main/utils';
import { findParamsToSelect } from '@main/utils/find-params-to-select';
import { seriesRepository } from '@repository/series';
import type { Request, Response } from 'express';

/**
 * @typedef {object} FindOneSeriesResponse
 * @property {string} message
 * @property {string} status
 * @property {Series} payload
 */

/**
 * GET /series/{id}
 * @summary Find one Series
 * @tags Series
 * @security BearerAuth
 * @param {integer} id.path.required
 * @return {FindOneSeriesResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {NotFoundRequest} 404 - Not found response - application/json
 */
export const findOneSeriesController: Controller =
  () =>
  async ({ lang, user, ...request }: Request, response: Response) => {
    try {
      const seriesId = toNumber(request.params.id);

      const seriesFindParamsQuery = findParamsToSelect([
        [seriesFindParams, 's'],
        [userSeriesSeasonProgressFindParams, 'ssp'],
        [userSeriesFindParams, 'us'],
        [categoryFindParams, 'c'],
        [tagFindParams, 't'],
        [themeFindParams, 'tl'],
        [seriesSeasonFindParams, 'ss']
      ]);

      const payload = await seriesRepository
        .createQueryBuilder('s')
        .select([...seriesFindParamsQuery, 'sc.id', 'st.id'])
        .leftJoinAndSelect('s.userSeriesList', 'us', 'us.userId = :userId', {
          userId: user.id
        })
        .leftJoinAndSelect('s.seriesCategoryList', 'sc', 'sc.finishedAt IS NULL')
        .leftJoinAndSelect('sc.category', 'c')
        .leftJoinAndSelect('s.seriesTagList', 'st', 'st.finishedAt IS NULL')
        .leftJoinAndSelect('st.tag', 't')
        .leftJoinAndSelect('s.themeList', 'tl', 'tl.finishedAt IS NULL')
        .leftJoinAndSelect('s.seriesSeasonList', 'ss', 'ss.finishedAt IS NULL')
        .leftJoinAndSelect(
          'ss.userSeriesSeasonProgressList',
          'ssp',
          'ssp.userId = :userId AND ssp.finishedAt IS NULL',
          {
            userId: user.id
          }
        )
        .where('s.id = :id', { id: seriesId })
        .andWhere('s.finishedAt IS NULL')
        .andWhere('t.finishedAt IS NULL')
        .andWhere('c.finishedAt IS NULL')
        .getOne();

      if (payload === null)
        return notFound({ entity: messages[lang].entity.series, lang, response });

      return ok({ payload: formatSeries(payload), lang, response });
    } catch (error) {
      errorLogger(error);

      return messageErrorResponse({ error, lang, response });
    }
  };
