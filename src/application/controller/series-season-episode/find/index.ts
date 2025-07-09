import { seriesSeasonEpisodeFindParams } from '@data/search';
import type { seriesSeasonEpisodeQueryFields } from '@data/validation';
import { seriesSeasonEpisodeListQueryFields } from '@data/validation';
import type { Controller } from '@domain/protocols';
import {
  errorLogger,
  getGenericFilter,
  getPagination,
  messageErrorResponse,
  ok
} from '@main/utils';
import { seriesSeasonEpisodeRepository } from '@repository/series-season-episode';
import type { Request, Response } from 'express';

/**
 * @typedef {object} FindSeriesSeasonEpisodePayload
 * @property {array<SeriesSeasonEpisode>} content
 * @property {number} totalElements
 * @property {number} totalPages
 */

/**
 * @typedef {object} FindSeriesSeasonEpisodeResponse
 * @property {string} message
 * @property {string} status
 * @property {FindSeriesSeasonEpisodePayload} payload
 */

/**
 * GET /episode
 * @summary Find Series Season Episode
 * @tags Series Season Episode
 * @security BearerAuth
 * @param {string} name.query
 * @param {integer} seasonId.query
 * @param {integer} page.query
 * @param {integer} limit.query
 * @param {string} startDate.query (Ex: 2024-01-01).
 * @param {string} endDate.query (Ex: 2024-01-01).
 * @param {string} orderBy.query - enum:name,createdAt
 * @param {string} sort.query - enum:asc,desc
 * @return {FindSeriesSeasonEpisodeResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 */
export const findSeriesSeasonEpisodeController: Controller =
  () =>
  async ({ query, lang }: Request, response: Response) => {
    try {
      const { skip, take } = getPagination({ query });

      const { orderBy: order, where } = getGenericFilter<seriesSeasonEpisodeQueryFields>({
        list: seriesSeasonEpisodeListQueryFields,
        query
      });

      const [content, totalElements] = await seriesSeasonEpisodeRepository.findAndCount({
        order,
        select: seriesSeasonEpisodeFindParams,
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
