import { getWatchStatusOrder } from '@application/helper';
import { updateMultipleUserMovieSchema } from '@data/validation';
import { WatchStatus } from '@domain/enum';
import type { Controller } from '@domain/protocols';
import { UserMovieEntity } from '@entity/user-movie';
import { messages } from '@i18n/index';
import { errorLogger, messageErrorResponse, ok } from '@main/utils';
import { userMovieRepository } from '@repository/user-movie';
import type { Request, Response } from 'express';

interface Body {
  movie: {
    id: number;
    favorite?: boolean;
    watchStatus?: WatchStatus;
    score?: number;
  }[];
}

/**
 * @typedef {object} MultipleUpdateUserMovieBody
 * @property {array<UpdateUserMovieBody>} movie
 */

/**
 * POST /user-movie
 * @summary Multiple User Movie
 * @tags User Movie
 * @security BearerAuth
 * @param {MultipleUpdateUserMovieBody} request.body
 * @return {UpdateResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {ForbiddenRequest} 403 - Forbidden response - application/json
 */
export const upsertMultipleUserMovieController: Controller =
  () =>
  async ({ lang, ...request }: Request, response: Response) => {
    try {
      await updateMultipleUserMovieSchema.validate(request, { abortEarly: false });

      const { movie } = request.body as Body;

      const userMovie: Partial<UserMovieEntity>[] = movie?.map(
        ({ id, favorite, score, watchStatus }) => ({
          favorite,
          score,
          watchStatus,
          watchStatusOrder: watchStatus ? getWatchStatusOrder(watchStatus) : undefined,
          userId: request.user.id,
          movieId: id
        })
      );

      if (userMovie?.length)
        await userMovieRepository.upsert(userMovie, {
          conflictPaths: ['userId', 'movieId'],
          upsertType: 'on-conflict-do-update',
          skipUpdateIfNoValuesChanged: true
        });

      return ok({ payload: messages[lang].default.successfullyUpdated, lang, response });
    } catch (error) {
      errorLogger(error);

      return messageErrorResponse({ error, lang, response });
    }
  };
