import type { Controller } from '@domain/protocols';
import { TMDBApi } from '@infra/tmdb';
import { badRequest, errorLogger, messageErrorResponse, ok } from '@main/utils';
import type { Request, Response } from 'express';

/**
 * @typedef {object} FindTMDBMovieByIdResponse
 * @property {string} message
 * @property {string} status
 * @property {object} payload
 */

/**
 * GET /tmdb/search
 * @summary Search in TMDB
 * @tags TMDB
 * @security BearerAuth
 * @param {string} query.query.required
 * @return {FindTMDBMovieByIdResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {NotFoundRequest} 404 - Not found response - application/json
 */
export const searchTMDBController: Controller =
  () =>
  async ({ lang, query }: Request, response: Response) => {
    try {
      const { search } = TMDBApi();

      if (typeof query.query !== 'string') return badRequest({ lang, response });

      const payload = await search(query.query);

      if (payload === null) return badRequest({ lang, response });

      return ok({ payload, lang, response });
    } catch (error) {
      errorLogger(error);

      return messageErrorResponse({ error, lang, response });
    }
  };
