import { tagFindParams } from '@data/search';
import type { tagQueryFields } from '@data/validation';
import { tagListQueryFields } from '@data/validation';
import type { Controller } from '@domain/protocols';
import {
  errorLogger,
  getGenericFilter,
  getPagination,
  messageErrorResponse,
  ok
} from '@main/utils';
import { tagRepository } from '@repository/tag';
import type { Request, Response } from 'express';

/**
 * @typedef {object} FindTagPayload
 * @property {array<Tag>} content
 * @property {number} totalElements
 * @property {number} totalPages
 */

/**
 * @typedef {object} FindTagResponse
 * @property {string} message
 * @property {string} status
 * @property {FindTagPayload} payload
 */

/**
 * GET /tag
 * @summary Find Tags
 * @tags Tag
 * @security BearerAuth
 * @param {string} name.query
 * @param {integer} page.query
 * @param {integer} limit.query
 * @param {string} orderBy.query - enum:name,createdAt
 * @param {string} sort.query - enum:asc,desc
 * @return {FindTagResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 */
export const findTagController: Controller =
  () =>
  async ({ query, lang }: Request, response: Response) => {
    try {
      const { skip, take } = getPagination({ query });

      const { orderBy: order, where } = getGenericFilter<tagQueryFields>({
        list: tagListQueryFields,
        query
      });

      const [content, totalElements] = await tagRepository.findAndCount({
        order,
        select: tagFindParams,
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
