import { finishedAt } from '@application/helper';
import { userSeriesFindParams } from '@data/search';
import type { Controller } from '@domain/protocols';
import { messages } from '@i18n/index';
import { errorLogger, messageErrorResponse, notFound, ok, toNumber } from '@main/utils';
import { userSeriesRepository } from '@repository/user-series';
import type { Request, Response } from 'express';

/**
 * @typedef {object} FindOneUserSeriesResponse
 * @property {string} message
 * @property {string} status
 * @property {UserSeries} payload
 */

/**
 * GET /user-series/{seriesId}
 * @summary Find one User Series
 * @tags User Series
 * @security BearerAuth
 * @param {integer} seriesId.path.required
 * @return {FindOneUserSeriesResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {NotFoundRequest} 404 - Not found response - application/json
 */
export const findOneUserSeriesController: Controller =
  () =>
  async ({ lang, ...request }: Request, response: Response) => {
    try {
      const payload = await userSeriesRepository.findOne({
        select: userSeriesFindParams,
        where: { finishedAt, seriesId: toNumber(request.params.seriesId), userId: request.user.id }
      });

      if (payload === null)
        return notFound({ entity: messages[lang].entity.userSeries, lang, response });

      return ok({ payload, lang, response });
    } catch (error) {
      errorLogger(error);

      return messageErrorResponse({ error, lang, response });
    }
  };
