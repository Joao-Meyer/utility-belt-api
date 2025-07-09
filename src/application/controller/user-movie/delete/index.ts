import { getWatchStatusOrder } from '@application/helper';
import { WatchStatus } from '@domain/enum';
import type { Controller } from '@domain/protocols';
import { messages } from '@i18n/index';
import { badRequest, errorLogger, ok, toNumber } from '@main/utils';
import { userMovieRepository } from '@repository/user-movie';
import type { Request, Response } from 'express';

/**
 * DELETE /user-movie/{movieId}
 * @summary Delete User Movie
 * @tags User Movie
 * @security BearerAuth
 * @param {integer} movieId.path.required
 * @return {DeleteResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {ForbiddenRequest} 403 - Forbidden response - application/json
 */
export const deleteUserMovieController: Controller =
  () =>
  async ({ lang, user, ...request }: Request, response: Response) => {
    try {
      await userMovieRepository.upsert(
        {
          favorite: false,
          watchStatus: WatchStatus.NONE,
          watchStatusOrder: getWatchStatusOrder(WatchStatus.NONE),
          userId: user.id,
          movieId: toNumber(request.params.movieId)
        },
        {
          conflictPaths: ['userId', 'movieId'],
          upsertType: 'on-conflict-do-update',
          skipUpdateIfNoValuesChanged: true
        }
      );

      return ok({ payload: messages[lang].default.successfullyDeleted, lang, response });
    } catch (error) {
      errorLogger(error);
      return badRequest({ lang, response });
    }
  };
