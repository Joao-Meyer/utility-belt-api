import { canUpdatePlaylistItem } from '@application/helper';
import type { Controller } from '@domain/protocols';
import { messages } from '@i18n/index';
import { badRequest, errorLogger, forbidden, ok, toNumber } from '@main/utils';
import { playlistItemRepository } from '@repository/playlist-item';
import type { Request, Response } from 'express';

/**
 * DELETE /playlist/{playlistId}/item/{id}
 * @summary Delete Playlist Item
 * @tags Playlist Item
 * @security BearerAuth
 * @param {integer} playlistId.path.required
 * @param {integer} id.path.required
 * @return {DeleteResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {ForbiddenRequest} 403 - Forbidden response - application/json
 */
export const deletePlaylistItemController: Controller =
  () =>
  async ({ lang, ...request }: Request, response: Response) => {
    try {
      if (
        !(await canUpdatePlaylistItem(
          toNumber(request.params.id),
          toNumber(request.params.playlistId),
          request.user.id
        ))
      )
        return forbidden({ lang, response });

      await playlistItemRepository.delete({ id: toNumber(request.params.id) });

      return ok({ payload: messages[lang].default.successfullyDeleted, lang, response });
    } catch (error) {
      errorLogger(error);
      return badRequest({ lang, response });
    }
  };
