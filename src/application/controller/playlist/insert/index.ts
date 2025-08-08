import { insertPlaylistSchema } from '@data/validation';
import { PlaylistVisibility } from '@domain/enum';
import type { Controller } from '@domain/protocols';
import { PlaylistEntity } from '@entity/playlist';
import { UserPlaylistEntity } from '@entity/user-playlist';
import { DataSource } from '@infra/database';
import { created, errorLogger, insertId, messageErrorResponse } from '@main/utils';
import type { Request, Response } from 'express';

interface Body {
  name: string;
  visibility: PlaylistVisibility;
  imageUrl?: string;
  parentId?: number;
}

/**
 * @typedef {object} InsertPlaylistBody
 * @property {string} name.required
 * @property {string} visibility.required -enum:PUBLIC,PRIVATE
 * @property {string} imageUrl
 * @property {integer} parentId
 */

/**
 * POST /playlist
 * @summary Insert Playlist
 * @tags Playlist
 * @security BearerAuth
 * @param {InsertPlaylistBody} request.body.required
 * @return {CreatedResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 */
export const insertPlaylistController: Controller =
  () =>
  async ({ lang, ...request }: Request, response: Response) => {
    try {
      await insertPlaylistSchema.validate(request, { abortEarly: false });

      const { imageUrl: image, name, visibility, parentId } = request.body as Body;

      const imageUrl = image === 'null' ? null : image;

      await DataSource.transaction(async (manager) => {
        const playlistId = insertId(
          await manager.insert(PlaylistEntity, {
            imageUrl,
            name,
            visibility,
            parent: { id: parentId },
            owner: { id: request.user.id }
          })
        );

        if (typeof parentId === 'undefined')
          await manager.insert(UserPlaylistEntity, {
            isOwner: true,
            isCollaborator: true,
            playlist: { id: playlistId },
            user: { id: request.user.id }
          });
      });

      return created({ response, lang });
    } catch (error) {
      errorLogger(error);

      return messageErrorResponse({ error, lang, response });
    }
  };
