import { playlistFindParams, userFindParams, userPlaylistFindParams } from '@data/search';
import type { Controller } from '@domain/protocols';
import { messages } from '@i18n/index';
import { errorLogger, messageErrorResponse, notFound, ok, toNumber } from '@main/utils';
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
 * GET /user-playlist/{id}
 * @summary Find User Playlists
 * @tags User Playlist
 * @security BearerAuth
 * @param {integer} id.path.required
 * @return {FindUserPlaylistResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 */
export const findOneUserPlaylistController: Controller =
  () =>
  async ({ lang, user, ...request }: Request, response: Response) => {
    try {
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
        .where('up.id = :id', { id: toNumber(request.params.id) })
        .andWhere('up.userId = :userId', { userId: user.id })
        .andWhere('up.finishedAt IS NULL')
        .orderBy(`sp.order`, 'DESC');

      const payload = await queryBuilder.getOne();

      if (payload === null)
        return notFound({ entity: messages[lang].entity.playlist, lang, response });

      return ok({ payload, lang, response });
    } catch (error) {
      errorLogger(error);

      return messageErrorResponse({ error, lang, response });
    }
  };
