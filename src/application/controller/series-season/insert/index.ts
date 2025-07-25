import { insertSeason } from '@application/helper';
import { insertSeriesSeasonSchema } from '@data/validation';
import { HistoryEntityType, HistoryType, SeasonStatus } from '@domain/enum';
import type { Controller } from '@domain/protocols';
import { EditHistoryEntity } from '@entity/edit-history';
import { ThemeEntity } from '@entity/theme';
import { DataSource } from '@infra/database';
import { created, errorLogger, messageErrorResponse } from '@main/utils';
import type { Request, Response } from 'express';

interface EpisodeBody {
  title: string;
  synopsis?: string;
  imageUrl: string;
  episodeNumber: number;
  tmdbId: number;
  seasonNumber: number;
  duration: number;
  airedAt?: Date | null;
}

interface Body {
  name: string;
  seriesId: number;
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

/**
 * @typedef {object} InsertSeriesSeasonBody
 * @property {string} name.required
 * @property {string} seriesId.required
 * @property {string} synopsis
 * @property {number} tmdbId.required
 * @property {string} imageUrl.required
 * @property {number} totalEpisodes.required
 * @property {string} status -enum:AIRING,COMPLETED,UPCOMING
 * @property {integer} seasonNumber.required
 * @property {string} airedAt
 * @property {string} airedEndAt
 * @property {array<InsertThemeBody>} themeList.required
 * @property {array<InsertSeriesSeasonEpisodeBody>} episodeList.required
 */

/**
 * POST /season
 * @summary Insert Series Season
 * @tags Series Season
 * @security BearerAuth
 * @param {InsertSeriesSeasonBody} request.body.required
 * @return {CreatedResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 */
export const insertSeriesSeasonController: Controller =
  () =>
  async ({ lang, ...request }: Request, response: Response) => {
    try {
      await insertSeriesSeasonSchema.validate(request, { abortEarly: false });

      const {
        imageUrl,
        name,
        seasonNumber,
        seriesId,
        status,
        totalEpisodes,
        tmdbId,
        airedAt,
        airedEndAt,
        episodeList,
        synopsis,
        themeList
      } = request.body as Body;

      await DataSource.transaction(async (manager) => {
        await insertSeason({
          manager,
          seasonList: [
            {
              imageUrl,
              name,
              seasonNumber,
              status,
              totalEpisodes,
              airedAt,
              airedEndAt,
              tmdbId,
              episodeList,
              synopsis,
              themeList
            }
          ],
          seriesId
        });

        await manager.insert(EditHistoryEntity, {
          userId: request.user.id,
          entityType: HistoryEntityType.SERIES,
          type: HistoryType.INSERT,
          entityId: seriesId,
          newData: {
            seriesSeasonList: [
              {
                imageUrl,
                name,
                seasonNumber,
                status,
                totalEpisodes,
                airedAt,
                tmdbId,
                airedEndAt,
                episodeList,
                synopsis,
                themeList
              }
            ]
          }
        });
      });

      return created({ response, lang });
    } catch (error) {
      errorLogger(error);

      return messageErrorResponse({ error, lang, response });
    }
  };
