import { finishedAt } from '@application/helper';
import { userMovieFindParams } from '@data/search';
import type { Controller } from '@domain/protocols';
import { messages } from '@i18n/index';
import { errorLogger, messageErrorResponse, notFound, ok, toNumber } from '@main/utils';
import { userMovieRepository } from '@repository/user-movie';
import type { Request, Response } from 'express';

/**
 * @typedef {object} FindOneUserMovieResponse
 * @property {string} message
 * @property {string} status
 * @property {UserMovie} payload
 */

/**
 * GET /user-movie/{movieId}
 * @summary Find one User Movie
 * @tags User Movie
 * @security BearerAuth
 * @param {integer} movieId.path.required
 * @return {FindOneUserMovieResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {NotFoundRequest} 404 - Not found response - application/json
 */
export const findOneUserMovieController: Controller =
  () =>
  async ({ lang, ...request }: Request, response: Response) => {
    try {
      const payload = await userMovieRepository.findOne({
        select: userMovieFindParams,
        where: { finishedAt, movieId: toNumber(request.params.movieId), userId: request.user.id }
      });

      if (payload === null)
        return notFound({ entity: messages[lang].entity.userMovie, lang, response });

      return ok({ payload, lang, response });
    } catch (error) {
      errorLogger(error);

      return messageErrorResponse({ error, lang, response });
    }
  };
