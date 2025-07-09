import { finishedAt, formatSeason } from '@application/helper';
import {
  seriesSeasonEpisodeFindParams,
  seriesSeasonFindParams,
  themeFindParams
} from '@data/search';
import type { Controller } from '@domain/protocols';
import { messages } from '@i18n/index';
import { errorLogger, messageErrorResponse, notFound, ok, toNumber } from '@main/utils';
import { seriesSeasonRepository } from '@repository/series-season';
import type { Request, Response } from 'express';

/**
 * @typedef {object} FindOneSeriesSeasonResponse
 * @property {string} message
 * @property {string} status
 * @property {SeriesSeason} payload
 */

/**
 * GET /season/{id}
 * @summary Find one Series Season
 * @tags Series Season
 * @security BearerAuth
 * @param {integer} id.path.required
 * @return {FindOneSeriesSeasonResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {NotFoundRequest} 404 - Not found response - application/json
 */
export const findOneSeriesSeasonController: Controller =
  () =>
  async ({ lang, ...request }: Request, response: Response) => {
    try {
      const payload = await seriesSeasonRepository.findOne({
        select: {
          ...seriesSeasonFindParams,
          seriesSeasonEpisodeList: seriesSeasonEpisodeFindParams,
          themeList: themeFindParams
        },
        where: { id: toNumber(request.params.id), finishedAt },
        relations: {
          themeList: true,
          seriesSeasonEpisodeList: true
        }
      });

      if (payload === null)
        return notFound({ entity: messages[lang].entity.seriesSeason, lang, response });

      return ok({ payload: formatSeason(payload), lang, response });
    } catch (error) {
      errorLogger(error);

      return messageErrorResponse({ error, lang, response });
    }
  };
