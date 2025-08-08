import { playlistFindParams, userFindParams, userPlaylistFindParams } from '@data/search';
import type { Controller } from '@domain/protocols';
import { errorLogger, getPagination, messageErrorResponse, ok } from '@main/utils';
import { findParamsToSelect } from '@main/utils/find-params-to-select';
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
 * GET /user-playlist/all
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
export const findUserPlaylistAllController: Controller =
  () =>
  async ({ query, lang, user }: Request, response: Response) => {
    try {
      const { skip, take } = getPagination({ query });

      const findParamsQuery = findParamsToSelect([
        [userPlaylistFindParams, 'up'],
        [playlistFindParams, 'p'],
        [userFindParams, 'o'],
        [playlistFindParams, 'sp']
      ]);

      const queryBuilder = userPlaylistRepository
        .createQueryBuilder('up')
        .select(findParamsQuery)
        .innerJoinAndSelect('up.playlist', 'p', 'p.finishedAt IS NULL')
        .leftJoinAndSelect('p.subPlaylistList', 'sp', 'sp.finishedAt IS NULL')
        .leftJoinAndSelect('p.owner', 'o')
        .where('up.userId = :userId', { userId: user.id })
        .andWhere('up.finishedAt IS NULL')
        .orderBy(
          `up.${query?.orderBy ?? 'createdAt'}`,
          query?.sort === 'ASC' || query?.sort === 'DESC' ? query?.sort : 'DESC'
        )
        .skip(skip)
        .take(take);

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
