import { finishedAt } from '@application/helper';
import { HistoryEntityType, HistoryType } from '@domain/enum';
import type { Controller } from '@domain/protocols';
import { EditHistoryEntity } from '@entity/edit-history';
import { MovieCategoryEntity } from '@entity/movie-category';
import { messages } from '@i18n/index';
import { DataSource } from '@infra/database';
import { badRequest, errorLogger, notFound, ok, toNumber } from '@main/utils';
import { movieCategoryRepository } from '@repository/movie-category';
import type { Request, Response } from 'express';

/**
 * DELETE /movie/category/{id}
 * @summary Delete Movie Category
 * @tags Movie
 * @security BearerAuth
 * @param {integer} id.path.required
 * @return {DeleteResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {ForbiddenRequest} 403 - Forbidden response - application/json
 */
export const deleteMovieCategoryController: Controller =
  () =>
  async ({ lang, ...request }: Request, response: Response) => {
    try {
      const movieCategory = await movieCategoryRepository.findOne({
        select: { id: true, category: { id: true, name: true }, movieId: true },
        where: { id: toNumber(request.params.id), finishedAt },
        relations: { category: true }
      });

      if (!movieCategory)
        return notFound({ entity: messages[lang].entity.category, lang, response });

      await DataSource.transaction(async (manager) => {
        await manager.delete(MovieCategoryEntity, { id: movieCategory.id });

        await manager.insert(EditHistoryEntity, {
          userId: request.user.id,
          entityType: HistoryEntityType.MOVIE,
          type: HistoryType.REMOVE,
          entityId: movieCategory.movieId,
          oldData: {
            categoryList: [{ id: movieCategory.category.id, name: movieCategory.category.name }]
          },
          newData: { categoryList: [] }
        });
      });

      return ok({ payload: messages[lang].default.successfullyDeleted, lang, response });
    } catch (error) {
      errorLogger(error);
      return badRequest({ lang, response });
    }
  };
