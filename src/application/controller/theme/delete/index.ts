import { finishedAt, getThemeHistoryData } from '@application/helper';
import { HistoryType } from '@domain/enum';
import type { Controller } from '@domain/protocols';
import { EditHistoryEntity } from '@entity/edit-history';
import { ThemeEntity } from '@entity/theme';
import { messages } from '@i18n/index';
import { DataSource } from '@infra/database';
import { badRequest, errorLogger, notFound, ok, toNumber } from '@main/utils';
import { themeRepository } from '@repository/theme';
import type { Request, Response } from 'express';

/**
 * DELETE /theme/{id}
 * @summary Delete Theme
 * @tags Theme
 * @security BearerAuth
 * @param {integer} id.path.required
 * @return {DeleteResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {ForbiddenRequest} 403 - Forbidden response - application/json
 */
export const deleteThemeController: Controller =
  () =>
  async ({ lang, ...request }: Request, response: Response) => {
    try {
      const theme = await themeRepository.findOne({
        select: {
          id: true,
          spotifyUrl: true,
          title: true,
          type: true,
          url: true,
          youtubeMusicUrl: true,
          youtubeId: true,
          order: true,
          movieId: true,
          seriesId: true,
          seriesSeasonId: true
        },
        where: { id: toNumber(request.params.id), finishedAt }
      });

      if (!theme) return notFound({ entity: messages[lang].entity.category, lang, response });

      await DataSource.transaction(async (manager) => {
        await manager.update(ThemeEntity, { id: theme.id }, { finishedAt: new Date() });

        await manager.insert(EditHistoryEntity, {
          userId: request.user.id,
          entityType: getThemeHistoryData(theme).entity,
          type: HistoryType.REMOVE,
          entityId: getThemeHistoryData(theme).id,
          oldData: { themeList: [theme] },
          newData: { themeList: [] }
        });
      });

      return ok({ payload: messages[lang].default.successfullyDeleted, lang, response });
    } catch (error) {
      errorLogger(error);
      return badRequest({ lang, response });
    }
  };
