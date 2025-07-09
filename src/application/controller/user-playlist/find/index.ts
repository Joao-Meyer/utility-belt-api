import { playlistFindParams, userPlaylistFindParams } from '@data/search';
import type { userPlaylistQueryFields } from '@data/validation';
import { userPlaylistListQueryFields } from '@data/validation';
import type { Controller } from '@domain/protocols';
import {
  errorLogger,
  getGenericFilter,
  getPagination,
  messageErrorResponse,
  ok
} from '@main/utils';
import { userPlaylistRepository } from '@repository/user-playlist';
import type { Request, Response } from 'express';

/**
 * @typedef {object} FindUserPlaylistPayload
 * @property {array<UserPlaylist>} content
 * @property {number} totalElements
 * @property {number} totalPages
 */

/**
 * @typedef {object} FindUserPlaylistResponse
 * @property {string} message
 * @property {string} status
 * @property {FindUserPlaylistPayload} payload
 */

/**
 * GET /user-playlist
 * @summary Find User Playlists
 * @tags User Playlist
 * @security BearerAuth
 * @param {string} name.query
 * @param {integer} page.query
 * @param {integer} limit.query
 * @param {string} startDate.query (Ex: 2024-01-01).
 * @param {string} endDate.query (Ex: 2024-01-01).
 * @param {string} orderBy.query - enum:name,createdAt
 * @param {string} sort.query - enum:asc,desc
 * @return {FindUserPlaylistResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 */
export const findUserPlaylistController: Controller =
  () =>
  async ({ query, lang, user }: Request, response: Response) => {
    try {
      const { skip, take } = getPagination({ query });

      const { orderBy: order, where } = getGenericFilter<userPlaylistQueryFields>({
        list: userPlaylistListQueryFields,
        query
      });

      Object.assign(where, { userId: user.id });

      const [content, totalElements] = await userPlaylistRepository.findAndCount({
        order,
        select: { ...userPlaylistFindParams, playlist: playlistFindParams },
        skip,
        take,
        relations: { playlist: true },
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
