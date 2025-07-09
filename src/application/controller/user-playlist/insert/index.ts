import { finishedAt } from '@application/helper';
import { playlistFindParams, userPlaylistFindParams } from '@data/search';
import { userPlaylistItemSchema } from '@data/validation';
import { PlaylistVisibility } from '@domain/enum';
import type { Controller } from '@domain/protocols';
import { UserPlaylistEntity } from '@entity/user-playlist';
import { DataSource } from '@infra/database';
import { created, errorLogger, forbidden, messageErrorResponse, toNumber } from '@main/utils';
import { playlistRepository } from '@repository/playlist';
import { userPlaylistRepository } from '@repository/user-playlist';
import type { Request, Response } from 'express';

interface Body {
  users?: { isCollaborator?: boolean; id: number }[];
}

/**
 * @typedef {object} UserPlaylistData
 * @property {number} id.required
 * @property {boolean} isCollaborator
 */

/**
 * @typedef {object} InsertUserPlaylistBody
 * @property {array<UserPlaylistData>} users
 */

/**
 * POST /user-playlist/{playlistId}
 * @summary User Playlist
 * @tags User Playlist
 * @security BearerAuth
 * @param {integer} playlistId.path.required
 * @param {InsertUserPlaylistBody} request.body.required - application/json
 * @return {UpdateResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {ForbiddenRequest} 403 - Forbidden response - application/json
 */
export const insertUserPlaylistController: Controller =
  () =>
  async ({ lang, ...request }: Request, response: Response) => {
    try {
      await userPlaylistItemSchema.validate(request, { abortEarly: false });

      const { users } = request.body as Body;

      const playlist = await playlistRepository.findOne({
        select: playlistFindParams,
        where: { id: toNumber(request.params.playlistId), finishedAt }
      });

      if (typeof users === 'undefined')
        if (playlist?.visibility === PlaylistVisibility.PUBLIC) {
          await userPlaylistRepository.insert({
            userId: request.user.id,
            playlistId: toNumber(request.params.playlistId)
          });
          return created({ lang, response });
        } else return forbidden({ lang, response });

      const userPlaylist = await userPlaylistRepository.findOne({
        select: userPlaylistFindParams,
        where: {
          userId: request.user.id,
          playlistId: toNumber(request.params.playlistId),
          finishedAt
        }
      });

      if (!userPlaylist?.isOwner || !userPlaylist.isCollaborator)
        return forbidden({ lang, response });

      await DataSource.transaction(async (manager) => {
        await manager.upsert(
          UserPlaylistEntity,
          users.map((item) => ({
            user: { id: item.id },
            playlist: { id: toNumber(request.params.playlistId) },
            isCollaborator: item.isCollaborator
          })),
          {
            conflictPaths: ['userId', 'playlistId'],
            upsertType: 'on-conflict-do-update',
            skipUpdateIfNoValuesChanged: true
          }
        );
      });

      return created({ lang, response });
    } catch (error) {
      errorLogger(error);

      return messageErrorResponse({ error, lang, response });
    }
  };
