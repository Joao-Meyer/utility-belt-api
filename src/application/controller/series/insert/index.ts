import { insertSeason, upsertCategory, upsertTag } from '@application/helper';
import { insertSeriesSchema } from '@data/validation';
import { HistoryEntityType, HistoryType, ReleaseStatus, SeasonStatus } from '@domain/enum';
import type { Controller } from '@domain/protocols';
import { EditHistoryEntity } from '@entity/edit-history';
import { SeriesEntity } from '@entity/series';
import { SeriesCategoryEntity } from '@entity/series-category';
import { SeriesTagEntity } from '@entity/series-tag';
import { ThemeEntity } from '@entity/theme';
import { DataSource } from '@infra/database';
import { created, errorLogger, insertId, messageErrorResponse } from '@main/utils';
import type { Request, Response } from 'express';

interface EpisodeBody {
  title: string;
  synopsis?: string;
  imageUrl: string;
  episodeNumber: number;
  seasonNumber: number;
  tmdbId: number;
  duration: number;
  airedAt?: Date | null;
}

interface SeasonBody {
  name: string;
  synopsis?: string;
  imageUrl: string;
  totalEpisodes: number;
  status: SeasonStatus;
  seasonNumber: number;
  tmdbId: number;
  airedAt?: Date | null;
  airedEndAt?: Date | null;
  themeList?: Partial<ThemeEntity>[];
  episodeList?: EpisodeBody[];
}

interface Body {
  title: string;
  originalTitle: string;
  imageUrl: string;
  homepage?: string;
  releaseStatus: ReleaseStatus;
  backdropImageUrl: string;
  imdbId?: string;
  trailerUrl?: string;
  tmdbId: number;
  trailerYoutubeId?: string;
  synopsis?: string;
  totalEpisodes: number;
  totalSeasons: number;
  airedAt?: Date | null;
  airedEndAt?: Date | null;
  alternativeTitleList?: string[];
  categoryList?: { name: string }[];
  tagList?: { name: string }[];
  themeList?: Partial<ThemeEntity>[];
  seasonList?: SeasonBody[];
}

/**
 * @typedef {object} InsertSeriesBody
 * @property {string} title.required
 * @property {string} originalTitle.required
 * @property {string} imageUrl.required
 * @property {string} homepage
 * @property {string} releaseStatus -enum:NOT_RELEASED,RELEASING,FINISHED,CANCELLED,HIATUS
 * @property {string} backdropImageUrl.required
 * @property {number} tmdbId.required
 * @property {string} imdbId
 * @property {string} trailerUrl
 * @property {string} trailerYoutubeId
 * @property {string} synopsis
 * @property {string} airedAt
 * @property {string} airedEndAt
 * @property {number} totalEpisodes.required
 * @property {number} totalSeasons.required
 * @property {array<string>} alternativeTitleList
 * @property {array<InsertCategoryBody>} categoryList.required
 * @property {array<InsertCategoryBody>} tagList.required
 * @property {array<InsertThemeBody>} themeList.required
 * @property {array<InsertSeriesSeasonBody>} seasonList.required
 */

/**
 * POST /series
 * @summary Insert Series
 * @tags Series
 * @security BearerAuth
 * @param {InsertSeriesBody} request.body.required
 * @return {CreatedResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 */
export const insertSeriesController: Controller =
  () =>
  async ({ lang, ...request }: Request, response: Response) => {
    try {
      await insertSeriesSchema.validate(request, { abortEarly: false });

      let series;
      const {
        title,
        releaseStatus,
        totalEpisodes,
        totalSeasons,
        airedEndAt,
        tmdbId,
        seasonList,
        alternativeTitleList,
        backdropImageUrl,
        categoryList,
        imageUrl,
        originalTitle,
        tagList,
        themeList,
        airedAt,
        homepage,
        imdbId,
        synopsis,
        trailerUrl,
        trailerYoutubeId
      } = request.body as Body;

      await DataSource.transaction(async (manager) => {
        const seriesId = insertId(
          await manager.insert(SeriesEntity, {
            title,
            backdropImageUrl,
            imageUrl,
            originalTitle,
            airedAt,
            homepage,
            releaseStatus,
            totalEpisodes,
            tmdbId,
            totalSeasons,
            airedEndAt,
            imdbId,
            alternativeTitleList: alternativeTitleList ?? [],
            synopsis,
            trailerUrl,
            trailerYoutubeId
          })
        );

        series = seriesId;

        if (categoryList?.length) {
          const categoryIds = await upsertCategory(manager, categoryList);

          const seriesCategories: Partial<SeriesCategoryEntity>[] = categoryIds.map((item) => ({
            category: { id: item },
            series: { id: seriesId }
          })) as SeriesCategoryEntity[];

          await manager.insert(SeriesCategoryEntity, seriesCategories);
        }

        if (tagList?.length) {
          const tagIds = await upsertTag(manager, tagList);

          const seriesTags: Partial<SeriesTagEntity>[] = tagIds.map((item) => ({
            tag: { id: item },
            series: { id: seriesId }
          })) as SeriesTagEntity[];

          await manager.insert(SeriesTagEntity, seriesTags);
        }

        if (themeList?.length)
          await manager.insert(
            ThemeEntity,
            themeList.map(
              ({ title, type, url, youtubeId, spotifyUrl, youtubeMusicUrl, order }) => ({
                title,
                type,
                url,
                spotifyUrl,
                youtubeId,
                youtubeMusicUrl,
                order,
                series: { id: seriesId }
              })
            )
          );

        if (seasonList?.length) await insertSeason({ manager, seasonList, seriesId });

        await manager.insert(EditHistoryEntity, {
          userId: request.user.id,
          entityType: HistoryEntityType.SERIES,
          type: HistoryType.INSERT,
          entityId: seriesId,
          oldData: null,
          newData: {
            title,
            backdropImageUrl,
            imageUrl,
            originalTitle,
            airedAt,
            homepage,
            releaseStatus,
            totalEpisodes,
            totalSeasons,
            airedEndAt,
            imdbId,
            alternativeTitleList: alternativeTitleList ?? [],
            synopsis,
            trailerUrl,
            trailerYoutubeId
          }
        });
      });

      return created({ response, payload: { id: series }, lang });
    } catch (error) {
      errorLogger(error);

      return messageErrorResponse({ error, lang, response });
    }
  };
