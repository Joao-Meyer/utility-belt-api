import { finishedAt, formatMovie } from '@application/helper';
import { categoryFindParams, movieFindParams, tagFindParams, themeFindParams } from '@data/search';
import type { Controller } from '@domain/protocols';
import { messages } from '@i18n/index';
import { errorLogger, messageErrorResponse, notFound, ok, toNumber } from '@main/utils';
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
  async ({ lang, ...request }: Request, response: Response) => {
    try {
      const payload = await movieRepository.findOne({
        select: {
          ...movieFindParams,
          themeList: themeFindParams,
          movieCategoryList: { id: true, category: categoryFindParams },
          movieTagList: { id: true, tag: tagFindParams }
        },
        where: { id: toNumber(request.params.id), finishedAt },
        relations: {
          themeList: true,
          movieCategoryList: { category: true },
          movieTagList: { tag: true }
        }
      });

      if (payload === null)
        return notFound({ entity: messages[lang].entity.movie, lang, response });

      return ok({ payload: formatMovie(payload), lang, response });
    } catch (error) {
      errorLogger(error);

      return messageErrorResponse({ error, lang, response });
    }
  };
