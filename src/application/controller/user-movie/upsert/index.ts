import { getWatchStatusOrder } from '@application/helper';
import { updateUserMovieSchema } from '@data/validation';
import { WatchStatus } from '@domain/enum';
import type { Controller } from '@domain/protocols';
import { messages } from '@i18n/index';
import { errorLogger, messageErrorResponse, ok, toNumber } from '@main/utils';
import { userMovieRepository } from '@repository/user-movie';
import type { Request, Response } from 'express';

interface Body {
  favorite?: boolean;
  watchStatus?: WatchStatus;
  score?: number;
}

/**
 * @typedef {object} UpdateUserMovieBody
 * @property {boolean} favorite
 * @property {string} watchStatus -enum:NOT_STARTED,WATCHING,WATCHED,DROPPED,WATCH_LATER
 * @property {number} score
 */

/**
 * POST /user-movie/{movieId}
 * @summary User Movie
 * @tags User Movie
 * @security BearerAuth
 * @param {UpdateUserMovieBody} request.body
 * @param {integer} movieId.path.required
 * @return {UpdateResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {ForbiddenRequest} 403 - Forbidden response - application/json
 */
export const upsertUserMovieController: Controller =
  () =>
  async ({ lang, ...request }: Request, response: Response) => {
    try {
      await updateUserMovieSchema.validate(request, { abortEarly: false });

      const { favorite, score, watchStatus } = request.body as Body;

      await userMovieRepository.upsert(
        {
          favorite,
          score,
          watchStatus,
          watchStatusOrder: watchStatus ? getWatchStatusOrder(watchStatus) : undefined,
          userId: request.user.id,
          movieId: toNumber(request.params.movieId)
        },
        {
          conflictPaths: ['userId', 'movieId'],
          upsertType: 'on-conflict-do-update',
          skipUpdateIfNoValuesChanged: true
        }
      );

      return ok({ payload: messages[lang].default.successfullyUpdated, lang, response });
    } catch (error) {
      errorLogger(error);

      return messageErrorResponse({ error, lang, response });
    }
  };
