import { finishedAt, getDifferentObject } from '@application/helper';
import { updateSeriesSchema } from '@data/validation';
import { HistoryEntityType, HistoryType, ReleaseStatus } from '@domain/enum';
import type { Controller } from '@domain/protocols';
import { EditHistoryEntity } from '@entity/edit-history';
import { SeriesEntity } from '@entity/series';
import { messages } from '@i18n/index';
import { DataSource } from '@infra/database';
import { errorLogger, messageErrorResponse, notFound, ok, toNumber } from '@main/utils';
import { seriesRepository } from '@repository/series';
import type { Request, Response } from 'express';

interface Body {
  title?: string;
  originalTitle?: string;
  imageUrl?: string;
  homepage?: string;
  releaseStatus?: ReleaseStatus;
  backdropImageUrl?: string;
  imdbId?: string;
  trailerUrl?: string;
  trailerYoutubeId?: string;
  synopsis?: string;
  airedAt?: Date | null;
  airedEndAt?: Date | null;
  totalEpisodes?: number;
  totalSeasons?: number;
  alternativeTitleList?: string[];
}

/**
 * @typedef {object} UpdateSeriesBody
 * @property {string} title
 * @property {string} originalTitle
 * @property {string} imageUrl
 * @property {string} homepage
 * @property {string} releaseStatus -enum:NOT_RELEASED,RELEASING,FINISHED,CANCELLED,HIATUS
 * @property {string} backdropImageUrl
 * @property {string} imdbId
 * @property {string} trailerUrl
 * @property {string} trailerYoutubeId
 * @property {string} synopsis
 * @property {string} airedAt
 * @property {string} airedEndAt
 * @property {number} totalEpisodes
 * @property {number} totalSeasons
 * @property {array<string>} alternativeTitleList
 */

/**
 * PUT /series/{id}
 * @summary Update Series
 * @tags Series
 * @security BearerAuth
 * @param {UpdateSeriesBody} request.body
 * @param {integer} id.path.required
 * @return {UpdateResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {ForbiddenRequest} 403 - Forbidden response - application/json
 */
export const updateSeriesController: Controller =
  () =>
  async ({ lang, ...request }: Request, response: Response) => {
    try {
      await updateSeriesSchema.validate(request, { abortEarly: false });

      const {
        backdropImageUrl,
        imageUrl,
        originalTitle,
        title,
        airedAt,
        alternativeTitleList,
        homepage,
        imdbId,
        synopsis,
        trailerUrl,
        trailerYoutubeId,
        airedEndAt,
        releaseStatus,
        totalEpisodes,
        totalSeasons
      } = request.body as Body;

      const data = {
        backdropImageUrl,
        imageUrl,
        originalTitle,
        title,
        airedAt,
        alternativeTitleList,
        homepage,
        imdbId,
        synopsis,
        trailerUrl,
        trailerYoutubeId,
        airedEndAt,
        releaseStatus,
        totalEpisodes,
        totalSeasons
      };

      const series = await seriesRepository.findOne({
        select: {
          id: true,
          backdropImageUrl: true,
          imageUrl: true,
          originalTitle: true,
          title: true,
          airedAt: true,
          alternativeTitleList: true,
          homepage: true,
          imdbId: true,
          synopsis: true,
          trailerUrl: true,
          trailerYoutubeId: true,
          airedEndAt: true,
          releaseStatus: true,
          totalEpisodes: true,
          totalSeasons: true
        },
        where: { id: toNumber(request.params.id), finishedAt }
      });

      if (!series) return notFound({ entity: messages[lang].entity.series, lang, response });

      await DataSource.transaction(async (manager) => {
        const { oldData, newData } = getDifferentObject(series, data);

        if (Object.keys(newData).length === 0) return;

        await manager.update(SeriesEntity, { id: series.id }, newData);

        await manager.insert(EditHistoryEntity, {
          userId: request.user.id,
          entityType: HistoryEntityType.MOVIE,
          type: HistoryType.UPDATE,
          entityId: series.id,
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
