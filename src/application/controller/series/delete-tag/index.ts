import { finishedAt } from '@application/helper';
import { HistoryEntityType, HistoryType } from '@domain/enum';
import type { Controller } from '@domain/protocols';
import { EditHistoryEntity } from '@entity/edit-history';
import { SeriesTagEntity } from '@entity/series-tag';
import { messages } from '@i18n/index';
import { DataSource } from '@infra/database';
import { badRequest, errorLogger, notFound, ok, toNumber } from '@main/utils';
import { seriesTagRepository } from '@repository/series-tag';
import type { Request, Response } from 'express';

/**
 * DELETE /series/tag/{id}
 * @summary Delete Series Tag
 * @tags Series
 * @security BearerAuth
 * @param {integer} id.path.required
 * @return {DeleteResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {ForbiddenRequest} 403 - Forbidden response - application/json
 */
export const deleteSeriesTagController: Controller =
  () =>
  async ({ lang, ...request }: Request, response: Response) => {
    try {
      const seriesTag = await seriesTagRepository.findOne({
        select: { id: true, tag: { id: true, name: true }, seriesId: true },
        where: { id: toNumber(request.params.id), finishedAt },
        relations: { tag: true }
      });

      if (!seriesTag) return notFound({ entity: messages[lang].entity.tag, lang, response });

      await DataSource.transaction(async (manager) => {
        await manager.delete(SeriesTagEntity, { id: seriesTag.id });

        await manager.insert(EditHistoryEntity, {
          userId: request.user.id,
          entityType: HistoryEntityType.SERIES,
          type: HistoryType.REMOVE,
          entityId: seriesTag.seriesId,
          oldData: {
            tagList: [{ id: seriesTag.tag.id, name: seriesTag.tag.name }]
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
