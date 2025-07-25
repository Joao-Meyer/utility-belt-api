import { movieFindParamsQuery } from '@data/search';
import { WatchStatus } from '@domain/enum';
import type { Controller } from '@domain/protocols';
import { errorLogger, getPagination, messageErrorResponse, ok } from '@main/utils';
import { userMovieRepository } from '@repository/user-movie';
import type { Request, Response } from 'express';
/**
 * @typedef {object} FindUserMoviePayload
 * @property {array<UserMovie>} content
 * @property {number} totalElements
 * @property {number} totalPages
 */

/**
 * @typedef {object} FindUserMovieResponse
 * @property {string} message
 * @property {string} status
 * @property {FindUserMoviePayload} payload
 */

/**
 * GET /user-movie
 * @summary Find User Movies
 * @tags User Movie
 * @security BearerAuth
 * @param {string} name.query
 * @param {integer} page.query
 * @param {integer} limit.query
 * @param {string} startDate.query (Ex: 2024-01-01).
 * @param {string} endDate.query (Ex: 2024-01-01).
 * @param {string} orderBy.query - enum:name,createdAt
 * @param {string} sort.query - enum:asc,desc
 * @return {FindUserMovieResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 */
export const findUserMovieController: Controller =
  () =>
  async ({ query, lang, user }: Request, response: Response) => {
    try {
      const { skip, take } = getPagination({ query });

      const watchStatus = query.watchStatus as WatchStatus | undefined;
      const favorite = query.favorite === 'true' ? true : query.favorite === 'false' ? false : null;

      const queryBuilder = userMovieRepository
        .createQueryBuilder('um')
        .leftJoinAndSelect('um.movie', 'm')
        .select(movieFindParamsQuery)
        .orderBy('um.watchStatusOrder', 'ASC')
        .addOrderBy('um.createdAt', 'DESC')
        .skip(skip)
        .take(take)
        .where('um.userId = :userId', { userId: user.id })
        .andWhere('um.watchStatus != :noneStatus', { noneStatus: WatchStatus.NONE });

      if (watchStatus) queryBuilder.andWhere('um.watchStatus = :watchStatus', { watchStatus });

      if (typeof favorite === 'boolean') {
        queryBuilder.andWhere('um.favorite = :favorite', { favorite });
      }

      const [content, totalElements] = await queryBuilder.getManyAndCount();

      return ok({
        payload: {
          content,
          totalElements,
          totalPages: Math.ceil(totalElements / take)
        },
        lang,
        response
      });
    } catch (error) {
      errorLogger(error);

      return messageErrorResponse({ error, lang, response });
    }
  };
