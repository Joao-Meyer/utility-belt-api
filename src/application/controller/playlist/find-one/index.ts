import { finishedAt } from '@application/helper';
import { playlistFindParams, playlistItemFindParams, themeFindParams } from '@data/search';
import type { Controller } from '@domain/protocols';
import { messages } from '@i18n/index';
import { errorLogger, messageErrorResponse, notFound, ok, toNumber } from '@main/utils';
import { playlistRepository } from '@repository/playlist';
import type { Request, Response } from 'express';

/**
 * @typedef {object} FindOnePlaylistResponse
 * @property {string} message
 * @property {string} status
 * @property {Playlist} payload
 */

/**
 * GET /playlist/{id}
 * @summary Find one Playlist
 * @tags Playlist
 * @security BearerAuth
 * @param {integer} id.path.required
 * @return {FindOnePlaylistResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {NotFoundRequest} 404 - Not found response - application/json
 */
export const findOnePlaylistController: Controller =
  () =>
  async ({ lang, ...request }: Request, response: Response) => {
    try {
      const payload = await playlistRepository.findOne({
        select: {
          ...playlistFindParams,
          themeList: themeFindParams,
          playlistItemList: playlistItemFindParams,
          subPlaylistList: playlistFindParams
        },
        where: { id: toNumber(request.params.id), finishedAt },
        relations: {
          themeList: true,
          playlistItemList: { movie: true, series: true },
          subPlaylistList: true
        }
      });

      if (payload === null)
        return notFound({ entity: messages[lang].entity.playlist, lang, response });

      return ok({ payload, lang, response });
    } catch (error) {
      errorLogger(error);

      return messageErrorResponse({ error, lang, response });
    }
  };
