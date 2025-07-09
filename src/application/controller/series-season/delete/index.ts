import { finishedAt } from '@application/helper';
import { seriesSeasonFindParams } from '@data/search';
import { HistoryEntityType, HistoryType } from '@domain/enum';
import type { Controller } from '@domain/protocols';
import { EditHistoryEntity } from '@entity/edit-history';
import { SeriesSeasonEntity } from '@entity/series-season';
import { messages } from '@i18n/index';
import { DataSource } from '@infra/database';
import { badRequest, errorLogger, notFound, ok, toNumber } from '@main/utils';
import { seriesSeasonRepository } from '@repository/series-season';
import type { Request, Response } from 'express';

/**
 * DELETE /season/{id}
 * @summary Delete Series Season
 * @tags Series Season
 * @security BearerAuth
 * @param {integer} id.path.required
 * @return {DeleteResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {ForbiddenRequest} 403 - Forbidden response - application/json
 */
export const deleteSeriesSeasonController: Controller =
  () =>
  async ({ lang, ...request }: Request, response: Response) => {
    try {
      const season = await seriesSeasonRepository.findOne({
        select: seriesSeasonFindParams,
        where: { finishedAt, id: toNumber(request.params.id) }
      });

      if (!season) return notFound({ entity: messages[lang].entity.seriesSeason, lang, response });

      const data = {
        id: season.id,
        name: season.name,
        airedAt: season.airedAt,
        airedEndAt: season.airedEndAt,
        imageUrl: season.imageUrl,
        seasonNumber: season.seasonNumber,
        status: season.status,
        synopsis: season.synopsis,
        totalEpisodes: season.totalEpisodes,
        seriesId: season.seriesId
      };

      await DataSource.transaction(async (manager) => {
        await manager.update(
          SeriesSeasonEntity,
          { id: toNumber(request.params.id) },
          { finishedAt: new Date() }
        );

        await manager.insert(EditHistoryEntity, {
          userId: request.user.id,
          entityType: HistoryEntityType.SERIES,
          type: HistoryType.REMOVE,
          entityId: season.seriesId,
          oldData: {
            seriesSeasonList: [data]
          },
          newData: { seriesSeasonList: [] }
        });
      });

      return ok({ payload: messages[lang].default.successfullyDeleted, lang, response });
    } catch (error) {
      errorLogger(error);
      return badRequest({ lang, response });
    }
  };
