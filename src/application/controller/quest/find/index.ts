import { questFindParams, userFindParams } from '@data/search';
import type { questQueryFields } from '@data/validation';
import { questListQueryFields } from '@data/validation';
import type { Controller } from '@domain/protocols';
import {
  errorLogger,
  getGenericFilter,
  getPagination,
  messageErrorResponse,
  ok
} from '@main/utils';
import { questRepository } from '@repository/quest';
import type { Request, Response } from 'express';

/**
 * @typedef {object} FindQuestPayload
 * @property {array<Quest>} content
 * @property {number} totalElements
 * @property {number} totalPages
 */

/**
 * @typedef {object} FindQuestResponse
 * @property {string} message
 * @property {string} status
 * @property {FindQuestPayload} payload
 */

/**
 * GET /quest
 * @summary Find Quest
 * @tags Quest
 * @security BearerAuth
 * @param {string} name.query
 * @param {integer} createdBy.query
 * @param {integer} page.query
 * @param {integer} limit.query
 * @param {string} startDate.query (Ex: 2024-01-01).
 * @param {string} endDate.query (Ex: 2024-01-01).
 * @param {string} orderBy.query - enum:id,name,createdAt,updatedAt
 * @param {string} sort.query - enum:asc,desc
 * @return {FindQuestResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {ForbiddenRequest} 403 - Forbidden response - application/json
 */
export const findQuestController: Controller =
  () =>
  async ({ query, lang }: Request, response: Response) => {
    try {
      const { skip, take } = getPagination({ query });

      const { orderBy: order, where } = getGenericFilter<questQueryFields>({
        list: questListQueryFields,
        query
      });

      const [content, totalElements] = await questRepository.findAndCount({
        order,
        select: { ...questFindParams, createdBy: userFindParams, deletedBy: userFindParams },
        relations: { createdBy: true, deletedBy: true },
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
