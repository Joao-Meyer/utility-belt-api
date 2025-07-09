import { getWatchStatusOrder } from '@application/helper';
import { WatchStatus } from '@domain/enum';
import type { Controller } from '@domain/protocols';
import { messages } from '@i18n/index';
import { badRequest, errorLogger, ok, toNumber } from '@main/utils';
import { userSeriesRepository } from '@repository/user-series';
import type { Request, Response } from 'express';

/**
 * DELETE /user-series/{seriesId}
 * @summary Delete User Series
 * @tags User Series
 * @security BearerAuth
 * @param {integer} seriesId.path.required
 * @return {DeleteResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {ForbiddenRequest} 403 - Forbidden response - application/json
 */
export const deleteUserSeriesController: Controller =
  () =>
  async ({ lang, user, ...request }: Request, response: Response) => {
    try {
      await userSeriesRepository.upsert(
        {
          favorite: false,
          watchStatus: WatchStatus.NONE,
          userId: user.id,
          watchStatusOrder: getWatchStatusOrder(WatchStatus.NONE),
          seriesId: toNumber(request.params.seriesId)
        },
        {
          conflictPaths: ['userId', 'seriesId'],
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
