import type { Controller } from '@domain/protocols';
import { TMDBApi } from '@infra/tmdb';
import { badRequest, errorLogger, messageErrorResponse, ok } from '@main/utils';
import type { Request, Response } from 'express';

/**
 * @typedef {object} FindTMDBSeriesByIdResponse
 * @property {string} message
 * @property {string} status
 * @property {object} payload
 */

/**
 * GET /tmdb/series/{seriesId}
 * @summary Find Series By Id
 * @tags TMDB
 * @security BearerAuth
 * @param {string} seriesId.path.required
 * @return {FindTMDBSeriesByIdResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {NotFoundRequest} 404 - Not found response - application/json
 */
export const findSeriesByIdTMDBController: Controller =
  () =>
  async ({ lang, ...request }: Request, response: Response) => {
    try {
      const { findSeriesById } = TMDBApi();

      const payload = await findSeriesById(request.params.seriesId);

      if (payload === null) return badRequest({ lang, response });

      return ok({ payload, lang, response });
    } catch (error) {
      errorLogger(error);

      return messageErrorResponse({ error, lang, response });
    }
  };
