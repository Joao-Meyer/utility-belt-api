import type { Controller } from '@domain/protocols';
import { messages } from '@i18n/index';
import { badRequest, errorLogger, ok, toNumber } from '@main/utils';
import { seriesSeasonEpisodeRepository } from '@repository/series-season-episode';
import type { Request, Response } from 'express';

/**
 * DELETE /episode/{id}
 * @summary Delete Series Season Episode
 * @tags Series Season Episode
 * @security BearerAuth
 * @param {integer} id.path.required
 * @return {DeleteResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {ForbiddenRequest} 403 - Forbidden response - application/json
 */
export const deleteSeriesSeasonEpisodeController: Controller =
  () =>
  async ({ lang, ...request }: Request, response: Response) => {
    try {
      await seriesSeasonEpisodeRepository.delete({ id: toNumber(request.params.id) });

      return ok({ payload: messages[lang].default.successfullyDeleted, lang, response });
    } catch (error) {
      errorLogger(error);
      return badRequest({ lang, response });
    }
  };
