import { insertTagSchema } from '@data/validation';
import { HistoryEntityType, HistoryType } from '@domain/enum';
import type { Controller } from '@domain/protocols';
import { EditHistoryEntity } from '@entity/edit-history';
import { MovieTagEntity } from '@entity/movie-tag';
import { SeriesTagEntity } from '@entity/series-tag';
import { TagEntity } from '@entity/tag';
import { DataSource } from '@infra/database';
import { created, errorLogger, insertId, messageErrorResponse } from '@main/utils';
import type { Request, Response } from 'express';

interface Body {
  name: string;
  movieId?: number;
  seriesId?: number;
}

/**
 * @typedef {object} InsertTagBody
 * @property {string} name.required
 * @property {integer} movieId
 * @property {integer} seriesId
 */

/**
 * POST /tag
 * @summary Insert Tag
 * @tags Tag
 * @security BearerAuth
 * @param {InsertTagBody} request.body.required - application/json
 * @return {CreatedResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 */
export const insertTagController: Controller =
  () =>
  async ({ lang, ...request }: Request, response: Response) => {
    try {
      await insertTagSchema.validate(request, { abortEarly: false });

      const { name, movieId, seriesId } = request.body as Body;

      await DataSource.transaction(async (manager) => {
        const tagId = insertId(await manager.insert(TagEntity, { name }));

        if (typeof movieId === 'number') {
          await manager.insert(MovieTagEntity, {
            tag: { id: tagId },
            movie: { id: movieId }
          });

          await manager.insert(EditHistoryEntity, {
            userId: request.user.id,
            entityType: HistoryEntityType.MOVIE,
            type: HistoryType.UPDATE,
            entityId: movieId,
            oldData: null,
            newData: {
              tagList: [{ id: tagId, name }]
            }
          });
        }

        if (typeof seriesId === 'number') {
          await manager.insert(SeriesTagEntity, {
            tag: { id: tagId },
            series: { id: seriesId }
          });

          await manager.insert(EditHistoryEntity, {
            userId: request.user.id,
            entityType: HistoryEntityType.SERIES,
            type: HistoryType.UPDATE,
            entityId: seriesId,
            oldData: null,
            newData: {
              tagList: [{ id: tagId, name }]
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
