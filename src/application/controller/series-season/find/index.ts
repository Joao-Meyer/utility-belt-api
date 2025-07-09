import { seriesSeasonFindParams } from '@data/search';
import type { seriesSeasonQueryFields } from '@data/validation';
import { seriesSeasonListQueryFields } from '@data/validation';
import type { Controller } from '@domain/protocols';
import {
  errorLogger,
  getGenericFilter,
  getPagination,
  messageErrorResponse,
  ok
} from '@main/utils';
import { seriesSeasonRepository } from '@repository/series-season';
import type { Request, Response } from 'express';

/**
 * @typedef {object} FindSeriesSeasonPayload
 * @property {array<SeriesSeason>} content
 * @property {number} totalElements
 * @property {number} totalPages
 */

/**
 * @typedef {object} FindSeriesSeasonResponse
 * @property {string} message
 * @property {string} status
 * @property {FindSeriesSeasonPayload} payload
 */

/**
 * GET /season
 * @summary Find Series Season
 * @tags Series Season
 * @security BearerAuth
 * @param {string} name.query
 * @param {integer} seriesId.query
 * @param {integer} page.query
 * @param {integer} limit.query
 * @param {string} startDate.query (Ex: 2024-01-01).
 * @param {string} endDate.query (Ex: 2024-01-01).
 * @param {string} orderBy.query - enum:name,createdAt
 * @param {string} sort.query - enum:asc,desc
 * @return {FindSeriesSeasonResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 */
export const findSeriesSeasonController: Controller =
  () =>
  async ({ query, lang }: Request, response: Response) => {
    try {
      const { skip, take } = getPagination({ query });

      const { orderBy: order, where } = getGenericFilter<seriesSeasonQueryFields>({
        list: seriesSeasonListQueryFields,
        query
      });

      const [content, totalElements] = await seriesSeasonRepository.findAndCount({
        order,
        select: seriesSeasonFindParams,
        skip,
        take,
        where
      });

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
