import { seriesFindParamsQuery } from '@data/search';
import { WatchStatus } from '@domain/enum';
import type { Controller } from '@domain/protocols';
import { errorLogger, getPagination, messageErrorResponse, ok } from '@main/utils';
import { userSeriesRepository } from '@repository/user-series';
import type { Request, Response } from 'express';

/**
 * @typedef {object} FindUserSeriesPayload
 * @property {array<UserSeries>} content
 * @property {number} totalElements
 * @property {number} totalPages
 */

/**
 * @typedef {object} FindUserSeriesResponse
 * @property {string} message
 * @property {string} status
 * @property {FindUserSeriesPayload} payload
 */

/**
 * GET /user-series
 * @summary Find User Series
 * @tags User Series
 * @security BearerAuth
 * @param {string} name.query
 * @param {integer} page.query
 * @param {integer} limit.query
 * @param {string} startDate.query (Ex: 2024-01-01).
 * @param {string} endDate.query (Ex: 2024-01-01).
 * @param {string} orderBy.query - enum:name,createdAt
 * @param {string} sort.query - enum:asc,desc
 * @return {FindUserSeriesResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 */
export const findUserSeriesController: Controller =
  () =>
  async ({ query, lang, user }: Request, response: Response) => {
    try {
      const { skip, take } = getPagination({ query });

      const watchStatus = query.watchStatus as WatchStatus | undefined;

      const queryBuilder = userSeriesRepository
        .createQueryBuilder('us')
        .select(seriesFindParamsQuery)
        .leftJoinAndSelect('us.series', 's')
        .orderBy('us.watchStatusOrder', 'ASC')
        .addOrderBy('us.updatedAt', 'ASC')
        .skip(skip)
        .take(take)
        .where('us.userId = :userId', { userId: user.id })
        .andWhere('us.watchStatus != :noneStatus', { noneStatus: WatchStatus.NONE });

      if (watchStatus) queryBuilder.andWhere('us.watchStatus = :watchStatus', { watchStatus });

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
