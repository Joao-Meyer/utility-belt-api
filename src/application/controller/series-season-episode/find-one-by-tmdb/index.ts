import { finishedAt } from '@application/helper';
import { seriesSeasonEpisodeFindParams } from '@data/search';
import type { Controller } from '@domain/protocols';
import { errorLogger, messageErrorResponse, ok, toNumber } from '@main/utils';
import { seriesSeasonEpisodeRepository } from '@repository/series-season-episode';
import type { Request, Response } from 'express';

/**
 * GET /episode/tmdb/{id}
 * @summary Find one Episode
 * @tags Episode
 * @security BearerAuth
 * @param {integer} id.path.required
 * @return {FindOneEpisodeResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {NotFoundRequest} 404 - Not found response - application/json
 */
export const findOneEpisodeByTmdbIdController: Controller =
  () =>
  async ({ lang, ...request }: Request, response: Response) => {
    try {
      const payload = await seriesSeasonEpisodeRepository.findOne({
        select: seriesSeasonEpisodeFindParams,
        where: { tmdbId: toNumber(request.params.id), finishedAt }
      });

      return ok({ payload: payload ? payload : null, lang, response });
    } catch (error) {
      errorLogger(error);

      return messageErrorResponse({ error, lang, response });
    }
  };
