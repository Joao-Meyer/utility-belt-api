import { insertCategorySchema } from '@data/validation';
import { HistoryEntityType, HistoryType } from '@domain/enum';
import type { Controller } from '@domain/protocols';
import { CategoryEntity } from '@entity/category';
import { EditHistoryEntity } from '@entity/edit-history';
import { MovieCategoryEntity } from '@entity/movie-category';
import { SeriesCategoryEntity } from '@entity/series-category';
import { DataSource } from '@infra/database';
import { created, errorLogger, insertId, messageErrorResponse } from '@main/utils';
import type { Request, Response } from 'express';

interface Body {
  name: string;
  movieId?: number;
  seriesId?: number;
}

/**
 * @typedef {object} InsertCategoryBody
 * @property {string} name.required
 * @property {integer} movieId
 * @property {integer} seriesId
 */

/**
 * POST /category
 * @summary Insert Category
 * @tags Category
 * @security BearerAuth
 * @param {InsertCategoryBody} request.body.required - application/json
 * @return {CreatedResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 */
export const insertCategoryController: Controller =
  () =>
  async ({ lang, ...request }: Request, response: Response) => {
    try {
      await insertCategorySchema.validate(request, { abortEarly: false });

      const { name, movieId, seriesId } = request.body as Body;

      await DataSource.transaction(async (manager) => {
        const categoryId = insertId(await manager.insert(CategoryEntity, { name }));

        if (typeof movieId === 'number') {
          await manager.insert(MovieCategoryEntity, {
            category: { id: categoryId },
            movie: { id: movieId }
          });

          await manager.insert(EditHistoryEntity, {
            userId: request.user.id,
            entityType: HistoryEntityType.MOVIE,
            type: HistoryType.INSERT,
            entityId: movieId,
            oldData: null,
            newData: {
              categoryList: [{ id: categoryId, name }]
            }
          });
        }

        if (typeof seriesId === 'number') {
          await manager.insert(SeriesCategoryEntity, {
            category: { id: categoryId },
            series: { id: seriesId }
          });

          await manager.insert(EditHistoryEntity, {
            userId: request.user.id,
            entityType: HistoryEntityType.SERIES,
            type: HistoryType.INSERT,
            entityId: seriesId,
            oldData: null,
            newData: {
              categoryList: [{ id: categoryId, name }]
            }
          });
        }
      });

      return created({ lang, response });
    } catch (error) {
      errorLogger(error);

      return messageErrorResponse({ error, lang, response });
    }
  };
