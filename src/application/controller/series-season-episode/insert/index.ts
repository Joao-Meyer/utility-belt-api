import { insertEpisodeSeason } from '@application/helper';
import { insertSeriesSeasonEpisodeSchema } from '@data/validation';
import type { Controller } from '@domain/protocols';
import { DataSource } from '@infra/database';
import { created, errorLogger, messageErrorResponse } from '@main/utils';
import type { Request, Response } from 'express';

interface Body {
  title: string;
  seasonId: number;
  tmdbId: number;
  synopsis?: string;
  imageUrl: string;
  episodeNumber: number;
  seasonNumber: number;
  duration: number;
  airedAt?: Date | null;
}

/**
 * @typedef {object} InsertSeriesSeasonEpisodeBody
 * @property {string} name.required
 * @property {string} seriesId.required
 * @property {number} tmdbId.required
 * @property {string} synopsis
 * @property {string} imageUrl.required
 * @property {number} totalEpisodes.required
 * @property {string} status -enum:AIRING,COMPLETED,UPCOMING
 * @property {integer} seasonNumber.required
 * @property {string} airedAt
 * @property {string} airedEndAt
 */

/**
 * POST /episode
 * @summary Insert Series Season Episode
 * @tags Series Season Episode
 * @security BearerAuth
 * @param {InsertSeriesSeasonEpisodeBody} request.body.required
 * @return {CreatedResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 */
export const insertSeriesSeasonEpisodeController: Controller =
  () =>
  async ({ lang, ...request }: Request, response: Response) => {
    try {
      await insertSeriesSeasonEpisodeSchema.validate(request, { abortEarly: false });

      const {
        duration,
        episodeNumber,
        imageUrl,
        seasonId,
        seasonNumber,
        tmdbId,
        title,
        airedAt,
        synopsis
      } = request.body as Body;

      await DataSource.transaction(async (manager) => {
        await insertEpisodeSeason({
          manager,
          episodeList: [
            {
              duration,
              episodeNumber,
              imageUrl,
              seasonNumber,
              tmdbId,
              title,
              airedAt,
              synopsis
            }
          ],
          seasonId
        });
      });

      return created({ response, lang });
    } catch (error) {
      errorLogger(error);

      return messageErrorResponse({ error, lang, response });
    }
  };
