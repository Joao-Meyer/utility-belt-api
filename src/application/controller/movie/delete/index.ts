import type { Controller } from '@domain/protocols';
import { messages } from '@i18n/index';
import { badRequest, errorLogger, ok, toNumber } from '@main/utils';
import { movieRepository } from '@repository/movie';
import type { Request, Response } from 'express';

/**
 * DELETE /movie/{id}
 * @summary Delete Movie
 * @tags Movie
 * @security BearerAuth
 * @param {integer} id.path.required
 * @return {DeleteResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {ForbiddenRequest} 403 - Forbidden response - application/json
 */
export const deleteMovieController: Controller =
  () =>
  async ({ lang, ...request }: Request, response: Response) => {
    try {
      await movieRepository.update({ id: toNumber(request.params.id) }, { finishedAt: new Date() });

      return ok({ payload: messages[lang].default.successfullyDeleted, lang, response });
    } catch (error) {
      errorLogger(error);
      return badRequest({ lang, response });
    }
  };
