import { finishedAt, getDifferentObject, getThemeHistoryData } from '@application/helper';
import { updateThemeSchema } from '@data/validation';
import { HistoryType, ThemeType } from '@domain/enum';
import type { Controller } from '@domain/protocols';
import { EditHistoryEntity } from '@entity/edit-history';
import { ThemeEntity } from '@entity/theme';
import { messages } from '@i18n/index';
import { DataSource } from '@infra/database';
import { errorLogger, messageErrorResponse, notFound, ok, toNumber } from '@main/utils';
import { themeRepository } from '@repository/theme';
import type { Request, Response } from 'express';

interface Body {
  title?: string;
  type?: ThemeType;
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
 * @typedef {object} UpdateThemeBody
 * @property {string} title
 * @property {string} type -enum:OPENING,ENDING,MUSIC,VIDEO,TRAILER,OST
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
 * PUT /theme/{id}
 * @summary Update Theme
 * @tags Theme
 * @security BearerAuth
 * @param {UpdateThemeBody} request.body
 * @param {string} id.path.required
 * @return {UpdateResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {ForbiddenRequest} 403 - Forbidden response - application/json
 */
export const updateThemeController: Controller =
  () =>
  async ({ lang, ...request }: Request, response: Response) => {
    try {
      await updateThemeSchema.validate(request, { abortEarly: false });

      const theme = await themeRepository.findOne({
        select: {
          id: true,
          spotifyUrl: true,
          title: true,
          type: true,
          youtubeId: true,
          url: true,
          youtubeMusicUrl: true,
          order: true,
          movieId: true,
          seriesId: true,
          seriesSeasonId: true
        },
        where: { id: toNumber(request.params.id), finishedAt }
      });

      if (!theme) return notFound({ entity: messages[lang].entity.category, lang, response });

      const {
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
      } = request.body as Body;

      const data = {
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
      };

      await DataSource.transaction(async (manager) => {
        const { oldData, newData } = getDifferentObject(theme, data);

        if (Object.keys(newData).length === 0) return;

        await manager.update(ThemeEntity, { id: theme.id }, newData);

        await manager.insert(EditHistoryEntity, {
          userId: request.user.id,
          entityType: getThemeHistoryData(theme).entity,
          type: HistoryType.UPDATE,
          entityId: getThemeHistoryData(theme).id,
          oldData,
          newData
        });
      });

      return ok({ payload: messages[lang].default.successfullyUpdated, lang, response });
    } catch (error) {
      errorLogger(error);

      return messageErrorResponse({ error, lang, response });
    }
  };
