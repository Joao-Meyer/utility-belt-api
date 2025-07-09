import { canUpdatePlaylist } from '@application/helper';
import { insertPlaylistItemSchema } from '@data/validation';
import type { Controller } from '@domain/protocols';
import {
  badRequest,
  created,
  errorLogger,
  forbidden,
  messageErrorResponse,
  toNumber
} from '@main/utils';
import { playlistItemRepository } from '@repository/playlist-item';
import type { Request, Response } from 'express';

interface Body {
  movieId?: number;
  seriesId?: number;
}

/**
 * @typedef {object} InsertPlaylistItemBody
 * @property {string} movieId
 * @property {integer} seriesId
 */

/**
 * POST /playlist/{playlistId}/item
 * @summary Insert Playlist Item
 * @tags Playlist Item
 * @security BearerAuth
 * @param {integer} playlistId.path.required
 * @param {InsertPlaylistItemBody} request.body.required
 * @return {CreatedResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 */
export const insertPlaylistItemController: Controller =
  () =>
  async ({ lang, ...request }: Request, response: Response) => {
    try {
      await insertPlaylistItemSchema.validate(request, { abortEarly: false });

      const { movieId, seriesId } = request.body as Body;

      if (typeof movieId !== 'number' && typeof seriesId !== 'number')
        return badRequest({ lang, response });

      if (!(await canUpdatePlaylist(toNumber(request.params.playlistId), request.user.id)))
        return forbidden({ lang, response });

      await playlistItemRepository.insert({
        movie: { id: movieId },
        series: { id: seriesId },
        playlist: { id: toNumber(request.params.playlistId) }
      });

      return created({ response, lang });
    } catch (error) {
      errorLogger(error);

      return messageErrorResponse({ error, lang, response });
    }
  };
