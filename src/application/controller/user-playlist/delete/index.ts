import { finishedAt } from '@application/helper';
import { userPlaylistFindParams } from '@data/search';
import { deleteUserPlaylistItemSchema } from '@data/validation';
import type { Controller } from '@domain/protocols';
import { UserPlaylistEntity } from '@entity/user-playlist';
import { messages } from '@i18n/index';
import { DataSource } from '@infra/database';
import { badRequest, errorLogger, forbidden, ok, toNumber } from '@main/utils';
import { userPlaylistRepository } from '@repository/user-playlist';
import type { Request, Response } from 'express';

interface Body {
  users?: number[];
}

/**
 * @typedef {object} DeleteUserPlaylistBody
 * @property {array<number>} users
 */

/**
 * POST /user-playlist/{playlistId}/delete
 * @summary Delete User Playlist
 * @tags User Playlist
 * @security BearerAuth
 * @param {integer} playlistId.path.required
 * @return {DeleteResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {ForbiddenRequest} 403 - Forbidden response - application/json
 */
export const deleteUserPlaylistController: Controller =
  () =>
  async ({ lang, user, ...request }: Request, response: Response) => {
    try {
      await deleteUserPlaylistItemSchema.validate(request, { abortEarly: false });

      const { users } = request.body as Body;

      if (typeof users === 'undefined') {
        await userPlaylistRepository.delete({
          userId: user.id,
          playlistId: toNumber(request.params.playlistId)
        });

        return ok({ payload: messages[lang].default.successfullyDeleted, lang, response });
      }

      const userPlaylist = await userPlaylistRepository.findOne({
        select: userPlaylistFindParams,
        where: {
          userId: user.id,
          playlistId: toNumber(request.params.playlistId),
          finishedAt
        }
      });

      if (!userPlaylist?.isOwner || !userPlaylist.isCollaborator)
        return forbidden({ lang, response });

      await DataSource.transaction(async (manager) => {
        await manager.delete(
          UserPlaylistEntity,
          users.map((item) => ({
            userId: item,
            playlistId: toNumber(request.params.playlistId)
          }))
        );
      });

      return ok({ payload: messages[lang].default.successfullyDeleted, lang, response });
    } catch (error) {
      errorLogger(error);
      return badRequest({ lang, response });
    }
  };
