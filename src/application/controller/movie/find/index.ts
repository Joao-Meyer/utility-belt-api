import { movieFindParamsQuery } from '@data/search';
import type { movieQueryFields } from '@data/validation';
import { movieListQueryFields } from '@data/validation';
import type { Controller } from '@domain/protocols';
import {
  errorLogger,
  getGenericFilter,
  getPagination,
  messageErrorResponse,
  ok
} from '@main/utils';
import { movieRepository } from '@repository/movie';
import type { Request, Response } from 'express';

/**
 * @typedef {object} FindMoviePayload
 * @property {array<Movie>} content
 * @property {number} totalElements
 * @property {number} totalPages
 */

/**
 * @typedef {object} FindMovieResponse
 * @property {string} message
 * @property {string} status
 * @property {FindMoviePayload} payload
 */

/**
 * GET /movie
 * @summary Find Movies
 * @tags Movie
 * @security BearerAuth
 * @param {string} name.query
 * @param {integer} page.query
 * @param {integer} limit.query
 * @param {string} startDate.query (Ex: 2024-01-01).
 * @param {string} endDate.query (Ex: 2024-01-01).
 * @param {string} orderBy.query - enum:name,createdAt
 * @param {string} sort.query - enum:asc,desc
 * @return {FindMovieResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 */
export const findMovieController: Controller =
  () =>
  async ({ query, lang, user }: Request, response: Response) => {
    try {
      const { skip, take } = getPagination({ query });

      const { orderItem } = getGenericFilter<movieQueryFields>({
        list: movieListQueryFields,
        query
      });

      const queryBuilder = movieRepository
        .createQueryBuilder('m')
        .select(movieFindParamsQuery)
        .leftJoinAndSelect('m.userMovieList', 'um', 'um.userId = :userId', {
          userId: user.id
        })
        .where('um.id IS NULL OR um.watchStatus = :noneStatus', {
          noneStatus: 'NONE'
        })
        .orderBy(`m.${orderItem?.value ?? 'createdAt'}`, orderItem?.sort ?? 'DESC')
        .skip(skip)
        .take(take);

      const [content, totalElements] = await queryBuilder.getManyAndCount();

      const formattedContent = content.map((movie) => ({
        ...movie,
        userMovie: movie?.userMovieList?.[0] ?? null
      }));

      return ok({
        payload: {
          content: formattedContent,
          totalElements,
          totalPages: Math.ceil(totalElements / take)
        },
        lang,
        response
      });
    } catch (error) {
      console.log(error);

      errorLogger(error);

      return messageErrorResponse({ error, lang, response });
    }
  };
