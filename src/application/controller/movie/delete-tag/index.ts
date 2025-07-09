import { finishedAt } from '@application/helper';
import { HistoryEntityType, HistoryType } from '@domain/enum';
import type { Controller } from '@domain/protocols';
import { EditHistoryEntity } from '@entity/edit-history';
import { MovieTagEntity } from '@entity/movie-tag';
import { messages } from '@i18n/index';
import { DataSource } from '@infra/database';
import { badRequest, errorLogger, notFound, ok, toNumber } from '@main/utils';
import { movieTagRepository } from '@repository/movie-tag';
import type { Request, Response } from 'express';

/**
 * DELETE /movie/tag/{id}
 * @summary Delete Movie Tag
 * @tags Movie
 * @security BearerAuth
 * @param {integer} id.path.required
 * @return {DeleteResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {ForbiddenRequest} 403 - Forbidden response - application/json
 */
export const deleteMovieTagController: Controller =
  () =>
  async ({ lang, ...request }: Request, response: Response) => {
    try {
      const movieTag = await movieTagRepository.findOne({
        select: { id: true, tag: { id: true, name: true }, movieId: true },
        where: { id: toNumber(request.params.id), finishedAt },
        relations: { tag: true }
      });

      if (!movieTag) return notFound({ entity: messages[lang].entity.tag, lang, response });

      await DataSource.transaction(async (manager) => {
        await manager.delete(MovieTagEntity, { id: movieTag.id });

        await manager.insert(EditHistoryEntity, {
          userId: request.user.id,
          entityType: HistoryEntityType.MOVIE,
          type: HistoryType.REMOVE,
          entityId: movieTag.movieId,
          oldData: {
            tagList: [{ id: movieTag.tag.id, name: movieTag.tag.name }]
          },
          newData: { tagList: [] }
        });
      });
      return ok({ payload: messages[lang].default.successfullyDeleted, lang, response });
    } catch (error) {
      errorLogger(error);
      return badRequest({ lang, response });
    }
  };
