import { formatMovie } from '@application/helper';
import {
  categoryFindParams,
  movieFindParams,
  tagFindParams,
  themeFindParams,
  userMovieFindParams
} from '@data/search';
import type { Controller } from '@domain/protocols';
import { messages } from '@i18n/index';
import { errorLogger, messageErrorResponse, notFound, ok, toNumber } from '@main/utils';
import { findParamsToSelect } from '@main/utils/find-params-to-select';
import { movieRepository } from '@repository/movie';
import type { Request, Response } from 'express';

/**
 * @typedef {object} FindOneMovieResponse
 * @property {string} message
 * @property {string} status
 * @property {Movie} payload
 */

/**
 * GET /movie/{id}
 * @summary Find one Movie
 * @tags Movie
 * @security BearerAuth
 * @param {integer} id.path.required
 * @return {FindOneMovieResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {NotFoundRequest} 404 - Not found response - application/json
 */
export const findOneMovieController: Controller =
  () =>
  async ({ lang, user, ...request }: Request, response: Response) => {
    try {
      const movieId = toNumber(request.params.id);

      const movieFindParamsQuery = findParamsToSelect([
        [movieFindParams, 'm'],
        [userMovieFindParams, 'um'],
        [categoryFindParams, 'c'],
        [tagFindParams, 't'],
        [themeFindParams, 'tl']
      ]);

      const payload = await movieRepository
        .createQueryBuilder('m')
        .select([...movieFindParamsQuery, 'mc.id', 'mt.id'])
        .leftJoinAndSelect('m.userMovieList', 'um', 'um.userId = :userId', {
          userId: user.id
        })
        .leftJoinAndSelect('m.movieCategoryList', 'mc', 'mc.finishedAt IS NULL')
        .leftJoinAndSelect('mc.category', 'c')
        .leftJoinAndSelect('m.movieTagList', 'mt', 'mt.finishedAt IS NULL')
        .leftJoinAndSelect('mt.tag', 't')
        .leftJoinAndSelect('m.themeList', 'tl', 'tl.finishedAt IS NULL')
        .where('m.id = :id', { id: movieId })
        .andWhere('m.finishedAt IS NULL')
        .andWhere('c.finishedAt IS NULL')
        .andWhere('t.finishedAt IS NULL')
        .getOne();

      if (payload === null)
        return notFound({ entity: messages[lang].entity.movie, lang, response });

      return ok({ payload: formatMovie(payload), lang, response });
    } catch (error) {
      errorLogger(error);

      return messageErrorResponse({ error, lang, response });
    }
  };
