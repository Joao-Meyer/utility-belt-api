import { themeFindParams } from '@data/search';
import type { themeQueryFields } from '@data/validation';
import { themeListQueryFields } from '@data/validation';
import type { Controller } from '@domain/protocols';
import {
  errorLogger,
  getGenericFilter,
  getPagination,
  messageErrorResponse,
  ok
} from '@main/utils';
import { themeRepository } from '@repository/theme';
import type { Request, Response } from 'express';

/**
 * @typedef {object} FindThemePayload
 * @property {array<Theme>} content
 * @property {number} totalElements
 * @property {number} totalPages
 */

/**
 * @typedef {object} FindThemeResponse
 * @property {string} message
 * @property {string} status
 * @property {FindThemePayload} payload
 */

/**
 * GET /theme
 * @summary Find Theme
 * @tags Theme
 * @security BearerAuth
 * @param {string} name.query
 * @param {integer} page.query
 * @param {integer} limit.query
 * @param {string} orderBy.query - enum:name,createdAt
 * @param {string} sort.query - enum:asc,desc
 * @return {FindThemeResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 */
export const findThemeController: Controller =
  () =>
  async ({ query, lang }: Request, response: Response) => {
    try {
      const { skip, take } = getPagination({ query });

      const { orderBy: order, where } = getGenericFilter<themeQueryFields>({
        list: themeListQueryFields,
        query
      });

      const [content, totalElements] = await themeRepository.findAndCount({
        order,
        select: themeFindParams,
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
