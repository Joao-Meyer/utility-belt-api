import { finishedAt, formatSeries } from '@application/helper';
import { seriesFindParams } from '@data/search';
import type { Controller } from '@domain/protocols';
import { errorLogger, messageErrorResponse, ok, toNumber } from '@main/utils';
import { seriesRepository } from '@repository/series';
import type { Request, Response } from 'express';

/**
 * GET /series/tmdb/{id}
 * @summary Find one Series
 * @tags Series
 * @security BearerAuth
 * @param {integer} id.path.required
 * @return {FindOneSeriesResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {NotFoundRequest} 404 - Not found response - application/json
 */
export const findOneSeriesByTmdbIdController: Controller =
  () =>
  async ({ lang, ...request }: Request, response: Response) => {
    try {
      const payload = await seriesRepository.findOne({
        select: seriesFindParams,
        where: { tmdbId: toNumber(request.params.id), finishedAt }
      });

      return ok({ payload: payload ? formatSeries(payload) : null, lang, response });
    } catch (error) {
      errorLogger(error);

      return messageErrorResponse({ error, lang, response });
    }
  };
