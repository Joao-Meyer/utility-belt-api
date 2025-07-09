import { userFindParams } from '@data/search';
import type { userQueryFields } from '@data/validation';
import { userListQueryFields } from '@data/validation';
import type { Controller } from '@domain/protocols';
import {
  errorLogger,
  getGenericFilter,
  getPagination,
  messageErrorResponse,
  ok
} from '@main/utils';
import { userRepository } from '@repository/user';
import type { Request, Response } from 'express';

/**
 * @typedef {object} FindUserPayload
 * @property {array<User>} content
 * @property {number} totalElements
 * @property {number} totalPages
 */

/**
 * @typedef {object} FindUserResponse
 * @property {string} message
 * @property {string} status
 * @property {FindUserPayload} payload
 */

/**
 * GET /user
 * @summary Find Users
 * @tags User
 * @security BearerAuth
 * @param {string} name.query
 * @param {string} username.query
 * @param {integer} page.query
 * @param {integer} limit.query
 * @param {string} startDate.query (Ex: 2024-01-01).
 * @param {string} endDate.query (Ex: 2024-01-01).
 * @param {string} orderBy.query - enum:name,username,createdAt
 * @param {string} sort.query - enum:asc,desc
 * @return {FindUserResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 */
export const findUserController: Controller =
  () =>
  async ({ query, lang }: Request, response: Response) => {
    try {
      const { skip, take } = getPagination({ query });

      const { orderBy: order, where } = getGenericFilter<userQueryFields>({
        list: userListQueryFields,
        query
      });

      const [content, totalElements] = await userRepository.findAndCount({
        order,
        select: userFindParams,
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
