import { seriesFindParamsQuery } from '@data/search';
import type { seriesQueryFields } from '@data/validation';
import { seriesListQueryFields } from '@data/validation';
import { WatchStatus } from '@domain/enum';
import type { Controller } from '@domain/protocols';
import {
  errorLogger,
  getGenericFilter,
  getPagination,
  messageErrorResponse,
  ok
} from '@main/utils';
import { seriesRepository } from '@repository/series';
import type { Request, Response } from 'express';

/**
 * @typedef {object} FindSeriesPayload
 * @property {array<Series>} content
 * @property {number} totalElements
 * @property {number} totalPages
 */

/**
 * @typedef {object} FindSeriesResponse
 * @property {string} message
 * @property {string} status
 * @property {FindSeriesPayload} payload
 */

/**
 * GET /series
 * @summary Find Series
 * @tags Series
 * @security BearerAuth
 * @param {string} name.query
 * @param {integer} page.query
 * @param {integer} limit.query
 * @param {string} startDate.query (Ex: 2024-01-01).
 * @param {string} endDate.query (Ex: 2024-01-01).
 * @param {string} orderBy.query - enum:name,createdAt
 * @param {string} sort.query - enum:asc,desc
 * @return {FindSeriesResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 */
export const findSeriesController: Controller =
  () =>
  async ({ query, lang, user }: Request, response: Response) => {
    try {
      const { skip, take } = getPagination({ query });

      const { orderItem } = getGenericFilter<seriesQueryFields>({
        list: seriesListQueryFields,
        query
      });

      console.log({ skip, take });

      const queryBuilder = seriesRepository
        .createQueryBuilder('s')
        .select(seriesFindParamsQuery)
        .leftJoinAndSelect('s.userSeriesList', 'us', 'us.userId = :userId', {
          userId: user.id
        })
        .where('us.id IS NULL OR us.watchStatus = :noneStatus', {
          noneStatus: WatchStatus.NONE
        })
        .orderBy(`s.${orderItem?.value ?? 'createdAt'}`, orderItem?.sort ?? 'DESC')
        .skip(skip)
        .take(take);

      const [content, totalElements] = await queryBuilder.getManyAndCount();

      const formattedContent = content.map((series) => ({
        ...series,
        userSeries: series?.userSeriesList?.[0] ?? null
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
      errorLogger(error);

      return messageErrorResponse({ error, lang, response });
    }
  };
