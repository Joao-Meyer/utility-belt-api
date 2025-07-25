import { getThemeHistoryData } from '@application/helper';
import { insertThemeSchema } from '@data/validation';
import { HistoryType, ThemeType } from '@domain/enum';
import type { Controller } from '@domain/protocols';
import { EditHistoryEntity } from '@entity/edit-history';
import { ThemeEntity } from '@entity/theme';
import { DataSource } from '@infra/database';
import { created, errorLogger, messageErrorResponse } from '@main/utils';
import type { Request, Response } from 'express';

interface Body {
  title: string;
  type: ThemeType;
  url?: string;
  youtubeId?: string;
  youtubeMusicUrl?: string;
  spotifyUrl?: string;
  movieId?: number;
  seriesId?: number;
  seriesSeasonId?: number;
  playlistId?: number;
  order?: number;
}

/**
 * @typedef {object} InsertThemeBody
 * @property {string} title.required
 * @property {string} type.required -enum:OPENING,ENDING,MUSIC,VIDEO,TRAILER,OST
 * @property {string} url
 * @property {string} youtubeId
 * @property {string} youtubeMusicUrl
 * @property {string} spotifyUrl
 * @property {integer} movieId
 * @property {integer} seriesId
 * @property {integer} playlistId
 * @property {integer} order
 */

/**
 * POST /theme
 * @summary Insert Theme
 * @tags Theme
 * @security BearerAuth
 * @param {InsertThemeBody} request.body.required - application/json
 * @return {CreatedResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 */
export const insertThemeController: Controller =
  () =>
  async ({ lang, ...request }: Request, response: Response) => {
    try {
      await insertThemeSchema.validate(request, { abortEarly: false });

      const {
        title,
        movieId,
        seriesId,
        seriesSeasonId,
        type,
        order,
        youtubeId,
        playlistId,
        spotifyUrl,
        url,
        youtubeMusicUrl
      } = request.body as Body;

      const data = {
        title,
        movieId,
        seriesId,
        seriesSeasonId,
        type,
        order,
        playlistId,
        spotifyUrl,
        youtubeId,
        url,
        youtubeMusicUrl
      };

      await DataSource.transaction(async (manager) => {
        await manager.insert(ThemeEntity, data);

        await manager.insert(EditHistoryEntity, {
          userId: request.user.id,
          entityType: getThemeHistoryData(data).entity,
          type: HistoryType.INSERT,
          entityId: getThemeHistoryData(data).id,
          newData: { themeList: [data] }
        });
      });

      return created({ lang, response });
    } catch (error) {
      errorLogger(error);

      return messageErrorResponse({ error, lang, response });
    }
  };
