import { updateSeriesSeasonEpisodeSchema } from '@data/validation';
import type { Controller } from '@domain/protocols';
import { messages } from '@i18n/index';
import { errorLogger, messageErrorResponse, ok, toNumber } from '@main/utils';
import { seriesSeasonEpisodeRepository } from '@repository/series-season-episode';
import type { Request, Response } from 'express';

interface Body {
  title?: string;
  synopsis?: string;
  imageUrl?: string;
  episodeNumber?: number;
  seasonNumber?: number;
  duration?: number;
  airedAt?: Date | null;
}

/**
 * @typedef {object} UpdateSeriesSeasonEpisodeBody
 * @property {string} title
 * @property {string} synopsis
 * @property {string} imageUrl
 * @property {number} episodeNumber
 * @property {number} seasonNumber
 * @property {number} duration
 * @property {string} airedAt
 */

/**
 * PUT /episode/{id}
 * @summary Update Series Season Episode
 * @tags Series Season Episode
 * @security BearerAuth
 * @param {integer} id.path.required
 * @param {UpdateSeriesSeasonEpisodeBody} request.body
 * @return {UpdateResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {ForbiddenRequest} 403 - Forbidden response - application/json
 */
export const updateSeriesSeasonEpisodeController: Controller =
  () =>
  async ({ lang, ...request }: Request, response: Response) => {
    try {
      await updateSeriesSeasonEpisodeSchema.validate(request, { abortEarly: false });

      const { airedAt, duration, episodeNumber, imageUrl, seasonNumber, synopsis, title } =
        request.body as Body;

      await seriesSeasonEpisodeRepository.update(
        { id: toNumber(request.params.id) },
        {
          airedAt,
          duration,
          episodeNumber,
          imageUrl,
          seasonNumber,
          synopsis,
          title
        }
      );

      return ok({ payload: messages[lang].default.successfullyUpdated, lang, response });
    } catch (error) {
      errorLogger(error);

      return messageErrorResponse({ error, lang, response });
    }
  };
