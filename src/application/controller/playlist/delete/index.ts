import { canUpdatePlaylist } from '@application/helper';
import type { Controller } from '@domain/protocols';
import { messages } from '@i18n/index';
import { badRequest, errorLogger, forbidden, ok, toNumber } from '@main/utils';
import { playlistRepository } from '@repository/playlist';
import type { Request, Response } from 'express';

/**
 * DELETE /playlist/{id}
 * @summary Delete Playlist
 * @tags Playlist
 * @security BearerAuth
 * @param {integer} id.path.required
 * @return {DeleteResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {ForbiddenRequest} 403 - Forbidden response - application/json
 */
export const deletePlaylistController: Controller =
  () =>
  async ({ lang, ...request }: Request, response: Response) => {
    try {
      if (!(await canUpdatePlaylist(toNumber(request.params.id), request.user.id)))
        return forbidden({ lang, response });

      await playlistRepository.update(
        { id: toNumber(request.params.id) },
        { finishedAt: new Date() }
      );

      return ok({ payload: messages[lang].default.successfullyDeleted, lang, response });
    } catch (error) {
      errorLogger(error);
      return badRequest({ lang, response });
    }
  };
