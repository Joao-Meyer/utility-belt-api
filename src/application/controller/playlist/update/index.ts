import { canUpdatePlaylist } from '@application/helper';
import { updatePlaylistSchema } from '@data/validation';
import { PlaylistVisibility } from '@domain/enum';
import type { Controller } from '@domain/protocols';
import { messages } from '@i18n/index';
import { errorLogger, forbidden, messageErrorResponse, ok, toNumber } from '@main/utils';
import { playlistRepository } from '@repository/playlist';
import type { Request, Response } from 'express';

interface Body {
  name?: string;
  visibility?: PlaylistVisibility;
  imageUrl?: string;
  parentId?: number;
}

/**
 * @typedef {object} UpdatePlaylistBody
 * @property {string} name
 * @property {string} visibility -enum:PUBLIC,PRIVATE
 * @property {string} imageUrl
 * @property {number} parentId
 */

/**
 * PUT /playlist/{id}
 * @summary Update Playlist
 * @tags Playlist
 * @security BearerAuth
 * @param {UpdatePlaylistBody} request.body
 * @param {string} id.path.required
 * @return {UpdateResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {ForbiddenRequest} 403 - Forbidden response - application/json
 */
export const updatePlaylistController: Controller =
  () =>
  async ({ lang, ...request }: Request, response: Response) => {
    try {
      await updatePlaylistSchema.validate(request, { abortEarly: false });

      const { imageUrl, name, parentId, visibility } = request.body as Body;

      if (!(await canUpdatePlaylist(toNumber(request.params.id), request.user.id)))
        return forbidden({ lang, response });

      await playlistRepository.update(
        { id: toNumber(request.params.id), ownerId: request.user.id },
        { imageUrl, name, parentId, visibility }
      );

      return ok({ payload: messages[lang].default.successfullyUpdated, lang, response });
    } catch (error) {
      errorLogger(error);

      return messageErrorResponse({ error, lang, response });
    }
  };
