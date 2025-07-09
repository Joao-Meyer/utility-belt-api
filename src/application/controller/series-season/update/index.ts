import { finishedAt, getDifferentObject } from '@application/helper';
import { updateSeriesSeasonSchema } from '@data/validation';
import { HistoryEntityType, HistoryType, SeasonStatus } from '@domain/enum';
import type { Controller } from '@domain/protocols';
import { EditHistoryEntity } from '@entity/edit-history';
import { SeriesSeasonEntity } from '@entity/series-season';
import { messages } from '@i18n/index';
import { DataSource } from '@infra/database';
import { errorLogger, messageErrorResponse, notFound, ok, toNumber } from '@main/utils';
import { seriesSeasonRepository } from '@repository/series-season';
import type { Request, Response } from 'express';

interface Body {
  name?: string;
  synopsis?: string;
  imageUrl?: string;
  totalEpisodes?: number;
  status?: SeasonStatus;
  seasonNumber?: number;
  airedAt?: Date | null;
  airedEndAt?: Date | null;
}

/**
 * @typedef {object} UpdateSeriesSeasonBody
 * @property {string} name
 * @property {string} synopsis
 * @property {string} imageUrl
 * @property {number} totalEpisodes
 * @property {string} status -enum:AIRING,COMPLETED,UPCOMING
 * @property {number} seasonNumber
 * @property {string} airedAt
 * @property {string} airedEndAt
 */

/**
 * PUT /season/{id}
 * @summary Update Series Season
 * @tags Series Season
 * @security BearerAuth
 * @param {integer} id.path.required
 * @param {UpdateSeriesSeasonBody} request.body
 * @return {UpdateResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {ForbiddenRequest} 403 - Forbidden response - application/json
 */
export const updateSeriesSeasonController: Controller =
  () =>
  async ({ lang, ...request }: Request, response: Response) => {
    try {
      await updateSeriesSeasonSchema.validate(request, { abortEarly: false });

      const { airedAt, airedEndAt, imageUrl, name, seasonNumber, status, synopsis, totalEpisodes } =
        request.body as Body;

      const data = {
        airedAt,
        airedEndAt,
        imageUrl,
        name,
        seasonNumber,
        status,
        synopsis,
        totalEpisodes
      };

      const season = await seriesSeasonRepository.findOne({
        select: {
          id: true,
          airedAt: true,
          airedEndAt: true,
          imageUrl: true,
          name: true,
          seasonNumber: true,
          status: true,
          synopsis: true,
          seriesId: true,
          totalEpisodes: true
        },
        where: { id: toNumber(request.params.id), finishedAt }
      });

      if (!season) return notFound({ entity: messages[lang].entity.seriesSeason, lang, response });

      await DataSource.transaction(async (manager) => {
        const { oldData, newData } = getDifferentObject(season, data);

        if (Object.keys(newData).length === 0) return;

        await manager.update(SeriesSeasonEntity, { id: season.id }, newData);

        await manager.insert(EditHistoryEntity, {
          userId: request.user.id,
          entityType: HistoryEntityType.SERIES,
          type: HistoryType.UPDATE,
          entityId: season.seriesId,
          oldData: { seriesSeasonList: [oldData] },
          newData: { seriesSeasonList: [newData] }
        });
      });

      return ok({ payload: messages[lang].default.successfullyUpdated, lang, response });
    } catch (error) {
      errorLogger(error);

      return messageErrorResponse({ error, lang, response });
    }
  };
