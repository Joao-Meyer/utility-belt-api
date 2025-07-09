import { finishedAt } from '@application/helper';
import { HistoryEntityType, HistoryType } from '@domain/enum';
import type { Controller } from '@domain/protocols';
import { EditHistoryEntity } from '@entity/edit-history';
import { SeriesCategoryEntity } from '@entity/series-category';
import { messages } from '@i18n/index';
import { DataSource } from '@infra/database';
import { badRequest, errorLogger, notFound, ok, toNumber } from '@main/utils';
import { seriesCategoryRepository } from '@repository/series-category';
import type { Request, Response } from 'express';

/**
 * DELETE /series/category/{id}
 * @summary Delete Series Category
 * @tags Series
 * @security BearerAuth
 * @param {integer} id.path.required
 * @return {DeleteResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {ForbiddenRequest} 403 - Forbidden response - application/json
 */
export const deleteSeriesCategoryController: Controller =
  () =>
  async ({ lang, ...request }: Request, response: Response) => {
    try {
      const seriesCategory = await seriesCategoryRepository.findOne({
        select: { id: true, category: { id: true, name: true }, seriesId: true },
        where: { id: toNumber(request.params.id), finishedAt },
        relations: { category: true }
      });

      if (!seriesCategory)
        return notFound({ entity: messages[lang].entity.category, lang, response });

      await DataSource.transaction(async (manager) => {
        await manager.delete(SeriesCategoryEntity, { id: seriesCategory.id });

        await manager.insert(EditHistoryEntity, {
          userId: request.user.id,
          entityType: HistoryEntityType.SERIES,
          type: HistoryType.REMOVE,
          entityId: seriesCategory.seriesId,
          oldData: {
            categoryList: [{ id: seriesCategory.category.id, name: seriesCategory.category.name }]
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
