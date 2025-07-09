import type { Controller } from '@domain/protocols';
import { TMDBApi } from '@infra/tmdb';
import { badRequest, errorLogger, messageErrorResponse, ok, toNumber } from '@main/utils';
import type { Request, Response } from 'express';

/**
 * @typedef {object} FindTMDBSeasonResponse
 * @property {string} message
 * @property {string} status
 * @property {object} payload
 */

/**
 * GET /tmdb/series/{seriesId}/season/{seasonNumber}
 * @summary Find Series Season
 * @tags TMDB
 * @security BearerAuth
 * @param {string} seriesId.path.required
 * @param {integer} seasonNumber.path.required
 * @return {FindTMDBSeasonResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {NotFoundRequest} 404 - Not found response - application/json
 */
export const findSeasonTMDBController: Controller =
  () =>
  async ({ lang, ...request }: Request, response: Response) => {
    try {
      const { findSeason } = TMDBApi();

      const payload = await findSeason(
        request.params.seriesId,
        toNumber(request.params.seasonNumber)
      );

      if (payload === null) return badRequest({ lang, response });

      return ok({ payload, lang, response });
    } catch (error) {
      errorLogger(error);

      return messageErrorResponse({ error, lang, response });
    }
  };
