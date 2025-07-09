import { finishedAt, formatSeries } from '@application/helper';
import {
  categoryFindParams,
  seriesFindParams,
  seriesSeasonFindParams,
  tagFindParams,
  themeFindParams
} from '@data/search';
import type { Controller } from '@domain/protocols';
import { messages } from '@i18n/index';
import { errorLogger, messageErrorResponse, notFound, ok, toNumber } from '@main/utils';
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
  async ({ lang, ...request }: Request, response: Response) => {
    try {
      const payload = await seriesRepository.findOne({
        select: {
          ...seriesFindParams,
          themeList: themeFindParams,
          seriesCategoryList: { id: true, category: categoryFindParams },
          seriesTagList: { id: true, tag: tagFindParams },
          seriesSeasonList: seriesSeasonFindParams
        },
        where: { id: toNumber(request.params.id), finishedAt },
        relations: {
          themeList: true,
          seriesCategoryList: { category: true },
          seriesTagList: { tag: true },
          seriesSeasonList: true
        }
      });

      if (payload === null)
        return notFound({ entity: messages[lang].entity.series, lang, response });

      return ok({ payload: formatSeries(payload), lang, response });
    } catch (error) {
      errorLogger(error);

      return messageErrorResponse({ error, lang, response });
    }
  };
