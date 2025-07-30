import { updateMultipleUserSeriesSeasonProgressSchema } from '@data/validation';
import type { Controller } from '@domain/protocols';
import { messages } from '@i18n/index';
import { errorLogger, messageErrorResponse, ok } from '@main/utils';
import type { Request, Response } from 'express';

interface Body {
  watch: boolean;
  seasons: {
    id: number;
  }[];
}

/**
 * @typedef {object} MultipleUpdateUserSeriesSeasonProgressItemBody
 * @property {number} id.required
 */

/**
 * @typedef {object} MultipleUpdateUserSeriesSeasonProgressBody
 * @property {array<MultipleUpdateUserSeriesSeasonProgressItemBody>} seasons.required
 * @property {boolean} watch.required
 */

/**
 * POST /user-series/{seriesId}/season-progress
 * @summary Multiple User Series Season Progress
 * @tags User Series
 * @security BearerAuth
 * @param {MultipleUpdateUserSeriesSeasonProgressBody} request.body
 * @return {UpdateResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {ForbiddenRequest} 403 - Forbidden response - application/json
 */
export const upsertMultipleUserSeriesSeasonProgressController: Controller =
  () =>
  async ({ lang, ...request }: Request, response: Response) => {
    try {
      await updateMultipleUserSeriesSeasonProgressSchema.validate(request, { abortEarly: false });

      const { seasons, watch } = request.body as Body;
      console.log({ seasons, watch });

      return ok({ payload: messages[lang].default.successfullyUpdated, lang, response });
    } catch (error) {
      errorLogger(error);

      return messageErrorResponse({ error, lang, response });
    }
  };
