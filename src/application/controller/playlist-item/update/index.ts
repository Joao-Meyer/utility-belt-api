import { canUpdatePlaylistItem } from '@application/helper';
import { updatePlaylistSchema } from '@data/validation';
import type { Controller } from '@domain/protocols';
import { messages } from '@i18n/index';
import { errorLogger, forbidden, messageErrorResponse, ok, toNumber } from '@main/utils';
import { playlistItemRepository } from '@repository/playlist-item';
import type { Request, Response } from 'express';

interface Body {
  playlistId?: number;
  movieId?: number;
  seriesId?: number;
}

/**
 * @typedef {object} UpdatePlaylistItemBody
 * @property {string} playlistId.required
 * @property {string} movieId
 * @property {integer} seriesId
 */

/**
 * PUT /playlist/{playlistId}/item/{id}
 * @summary Update Playlist Item
 * @tags Playlist Item
 * @security BearerAuth
 * @param {string} playlistId.path.required
 * @param {string} id.path.required
 * @param {UpdatePlaylistItemBody} request.body
 * @return {UpdateResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {ForbiddenRequest} 403 - Forbidden response - application/json
 */
export const updatePlaylistItemController: Controller =
  () =>
  async ({ lang, ...request }: Request, response: Response) => {
    try {
      await updatePlaylistSchema.validate(request, { abortEarly: false });

      const { movieId, playlistId, seriesId } = request.body as Body;

      if (
        !(await canUpdatePlaylistItem(
          toNumber(request.params.id),
          toNumber(request.params.playlistId),
          request.user.id
        ))
      )
        return forbidden({ lang, response });

      await playlistItemRepository.update(
        { id: toNumber(request.params.id) },
        { movieId, playlistId, seriesId }
      );

      return ok({ payload: messages[lang].default.successfullyUpdated, lang, response });
    } catch (error) {
      errorLogger(error);

      return messageErrorResponse({ error, lang, response });
    }
  };
