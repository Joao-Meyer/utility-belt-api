import { finishedAt, formatMovie } from '@application/helper';
import { movieFindParams } from '@data/search';
import type { Controller } from '@domain/protocols';
import { errorLogger, messageErrorResponse, ok, toNumber } from '@main/utils';
import { movieRepository } from '@repository/movie';
import type { Request, Response } from 'express';

/**
 * GET /movie/tmdb/{id}
 * @summary Find one Movie
 * @tags Movie
 * @security BearerAuth
 * @param {integer} id.path.required
 * @return {FindOneMovieResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {NotFoundRequest} 404 - Not found response - application/json
 */
export const findOneMovieByTmdbIdController: Controller =
  () =>
  async ({ lang, ...request }: Request, response: Response) => {
    try {
      const payload = await movieRepository.findOne({
        select: movieFindParams,
        where: { tmdbId: toNumber(request.params.id), finishedAt }
      });

      return ok({ payload: payload ? formatMovie(payload) : null, lang, response });
    } catch (error) {
      errorLogger(error);

      return messageErrorResponse({ error, lang, response });
    }
  };
