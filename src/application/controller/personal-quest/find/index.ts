import { personalQuestFindParams, userFindParams } from '@data/search';
import type { personalQuestQueryFields } from '@data/validation';
import { personalQuestListQueryFields } from '@data/validation';
import type { Controller } from '@domain/protocols';
import {
  errorLogger,
  getGenericFilter,
  getPagination,
  messageErrorResponse,
  ok
} from '@main/utils';
import { personalQuestRepository } from '@repository/personal-quest';
import type { Request, Response } from 'express';

/**
 * @typedef {object} FindPersonalQuestPayload
 * @property {array<PersonalQuest>} content
 * @property {number} totalElements
 * @property {number} totalPages
 */

/**
 * @typedef {object} FindPersonalQuestResponse
 * @property {string} message
 * @property {string} status
 * @property {FindPersonalQuestPayload} payload
 */

/**
 * GET /personal-quest
 * @summary Find Personal Quest
 * @tags Personal Quest
 * @security BearerAuth
 * @param {string} name.query
 * @param {integer} userId.query
 * @param {integer} page.query
 * @param {integer} limit.query
 * @param {string} startDate.query (Ex: 2024-01-01).
 * @param {string} endDate.query (Ex: 2024-01-01).
 * @param {string} orderBy.query - enum:id,name,createdAt,updatedAt
 * @param {string} sort.query - enum:asc,desc
 * @return {FindPersonalQuestResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {ForbiddenRequest} 403 - Forbidden response - application/json
 */
export const findPersonalQuestController: Controller =
  () =>
  async ({ query, lang }: Request, response: Response) => {
    try {
      const { skip, take } = getPagination({ query });

      const { orderBy: order, where } = getGenericFilter<personalQuestQueryFields>({
        list: personalQuestListQueryFields,
        query
      });

      const [content, totalElements] = await personalQuestRepository.findAndCount({
        order,
        select: { ...personalQuestFindParams, user: userFindParams },
        skip,
        relations: { user: true },
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
