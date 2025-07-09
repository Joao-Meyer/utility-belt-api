import { finishedAt } from '@application/helper';
import { seriesSeasonEpisodeFindParams } from '@data/search';
import type { Controller } from '@domain/protocols';
import { messages } from '@i18n/index';
import { errorLogger, messageErrorResponse, notFound, ok, toNumber } from '@main/utils';
import { seriesSeasonEpisodeRepository } from '@repository/series-season-episode';
import type { Request, Response } from 'express';

/**
 * @typedef {object} FindOneSeriesSeasonEpisodeResponse
 * @property {string} message
 * @property {string} status
 * @property {SeriesSeasonEpisode} payload
 */

/**
 * GET /episode/{id}
 * @summary Find one Series Season Episode
 * @tags Series Season Episode
 * @security BearerAuth
 * @param {integer} id.path.required
 * @return {FindOneSeriesSeasonEpisodeResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {NotFoundRequest} 404 - Not found response - application/json
 */
export const findOneSeriesSeasonEpisodeController: Controller =
  () =>
  async ({ lang, ...request }: Request, response: Response) => {
    try {
      const payload = await seriesSeasonEpisodeRepository.findOne({
        select: seriesSeasonEpisodeFindParams,
        where: { id: toNumber(request.params.id), finishedAt }
      });

      if (payload === null)
        return notFound({ entity: messages[lang].entity.seriesSeasonEpisode, lang, response });

      return ok({ payload, lang, response });
    } catch (error) {
      errorLogger(error);

      return messageErrorResponse({ error, lang, response });
    }
  };
