import {
  movieFindParams,
  playlistFindParams,
  playlistItemFindParams,
  seriesFindParams,
  themeFindParams,
  userFindParams
} from '@data/search';
import { PlaylistVisibility } from '@domain/enum';
import type { Controller } from '@domain/protocols';
import { messages } from '@i18n/index';
import { errorLogger, messageErrorResponse, notFound, ok, toNumber } from '@main/utils';
import { findParamsToSelect } from '@main/utils/find-params-to-select';
import { playlistRepository } from '@repository/playlist';
import type { Request, Response } from 'express';

/**
 * @typedef {object} FindOnePlaylistResponse
 * @property {string} message
 * @property {string} status
 * @property {Playlist} payload
 */

/**
 * GET /playlist/{parentId}/{id}
 * @summary Find one Playlist
 * @tags Playlist
 * @security BearerAuth
 * @param {integer} id.path.required
 * @param {integer} parentId.path.required
 * @return {FindOnePlaylistResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {NotFoundRequest} 404 - Not found response - application/json
 */
export const findOnePlaylistParentController: Controller =
  () =>
  async ({ lang, user, ...request }: Request, response: Response) => {
    try {
      const findParamsQuery = findParamsToSelect([
        [playlistFindParams, 'p'],
        [userFindParams, 'o'],
        [themeFindParams, 't'],
        [playlistItemFindParams, 'pi'],
        [seriesFindParams, 's'],
        [movieFindParams, 'm'],
        [playlistFindParams, 'sp']
      ]);

      const queryBuilder = playlistRepository
        .createQueryBuilder('p')
        .select(findParamsQuery)
        .leftJoinAndSelect(
          'p.userPlaylistList',
          'up',
          'up.userId = :userId AND up.finishedAt IS NULL',
          {
            userId: user.id
          }
        )
        .leftJoinAndSelect('p.owner', 'o')
        .leftJoinAndSelect('p.themeList', 't')
        .leftJoinAndSelect('p.subPlaylistList', 'sp')
        .leftJoinAndSelect('p.playlistItemList', 'pi')
        .leftJoinAndSelect('pi.series', 's')
        .leftJoinAndSelect('pi.movie', 'm')
        .andWhere('p.id = :id AND p.parentId = :parentId', {
          visibility: PlaylistVisibility.PUBLIC,
          id: toNumber(request.params.id),
          parentId: toNumber(request.params.parentId)
        })
        .andWhere('p.finishedAt IS NULL')
        .orderBy('sp.order', 'DESC')
        .addOrderBy('pi.order', 'DESC');

      const payload = await queryBuilder.getOne();

      if (payload === null)
        return notFound({ entity: messages[lang].entity.playlist, lang, response });

      return ok({ payload, lang, response });
    } catch (error) {
      errorLogger(error);

      return messageErrorResponse({ error, lang, response });
    }
  };
