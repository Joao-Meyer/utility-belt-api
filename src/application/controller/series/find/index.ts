import { seriesFindParamsQuery } from '@data/search';
import { WatchStatus } from '@domain/enum';
import type { Controller } from '@domain/protocols';
import { errorLogger, getPagination, getQueryArray, messageErrorResponse, ok } from '@main/utils';
import { seriesRepository } from '@repository/series';
import type { Request, Response } from 'express';
import { Brackets } from 'typeorm';

/**
 * @typedef {object} FindSeriesPayload
 * @property {array<Series>} content
 * @property {number} totalElements
 * @property {number} totalPages
 */

/**
 * @typedef {object} FindSeriesResponse
 * @property {string} message
 * @property {string} status
 * @property {FindSeriesPayload} payload
 */

/**
 * GET /series
 * @summary Find Series
 * @tags Series
 * @security BearerAuth
 * @param {string} name.query
 * @param {integer} page.query
 * @param {integer} limit.query
 * @param {string} startDate.query (Ex: 2024-01-01).
 * @param {string} endDate.query (Ex: 2024-01-01).
 * @param {string} orderBy.query - enum:name,createdAt
 * @param {string} sort.query - enum:asc,desc
 * @return {FindSeriesResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 */
export const findSeriesController: Controller =
  () =>
  async ({ query, lang, user }: Request, response: Response) => {
    try {
      const { skip, take } = getPagination({ query });

      const categoryIds = getQueryArray(query.categoryIds);
      const tagIds = getQueryArray(query.tagIds);
      const watchStatus = getQueryArray(query.watchStatus);
      const favorite = query.favorite === 'true' ? true : query.favorite === 'false' ? false : null;

      const queryBuilder = seriesRepository
        .createQueryBuilder('s')
        .select(seriesFindParamsQuery)
        .leftJoinAndSelect('s.userSeriesList', 'us', 'us.userId = :userId', {
          userId: user.id
        })
        .orderBy(
          `s.${query?.orderBy ?? 'airedAt'}`,
          query?.sort === 'ASC' || query?.sort === 'DESC' ? query?.sort : 'DESC'
        )
        .skip(skip)
        .take(take);

      if (categoryIds?.length) {
        queryBuilder
          .leftJoin('s.seriesCategoryList', 'sc')
          .andWhere('sc.categoryId IN (:...categoryIds)', {
            categoryIds: categoryIds
          });
      }

      if (tagIds?.length) {
        queryBuilder.leftJoin('s.seriesTagList', 'st').andWhere('st.tagId IN (:...tagIds)', {
          tagIds: tagIds
        });
      }

      if (watchStatus?.filter((item) => item !== WatchStatus.NONE)?.length) {
        queryBuilder.andWhere('us.watchStatus IN (:...watchStatus)', {
          watchStatus: watchStatus?.filter((item) => item !== WatchStatus.NONE)
        });
      }

      if (favorite === true) {
        queryBuilder.andWhere('us.favorite = :favorite', { favorite });
      } else if (favorite === false) {
        queryBuilder.andWhere(
          'us.favorite = :favorite OR us.favorite IS NULL OR us.id IS NULL OR us.watchStatus = :noneStatus',
          { favorite, noneStatus: 'NONE' }
        );
      }

      if (watchStatus?.includes(WatchStatus.NONE)) {
        queryBuilder.andWhere('us.id IS NULL OR us.watchStatus = :noneStatus', {
          noneStatus: 'NONE'
        });
      }
      if (query?.search) {
        const searchTerm = `%${query.search}%`;

        queryBuilder.andWhere(
          new Brackets((qb) => {
            qb.where('s.title ILIKE :searchTerm', { searchTerm })
              .orWhere('s.originalTitle ILIKE :searchTerm', { searchTerm })
              .orWhere('s.synopsis ILIKE :searchTerm', { searchTerm })
              .orWhere(
                `EXISTS (
          SELECT 1 FROM unnest(s.alternativeTitleList) alt
          WHERE alt ILIKE :searchTerm
        )`,
                { searchTerm }
              );
          })
        );
      }

      const [content, totalElements] = await queryBuilder.getManyAndCount();

      const formattedContent = content.map((series) => {
        const { userSeriesList, ...data } = series;
        return {
          ...data,
          userSeries: userSeriesList?.[0] ?? null
        };
      });

      return ok({
        payload: {
          content: formattedContent,
          totalElements,
          totalPages: Math.ceil(totalElements / take)
        },
        lang,
        response
      });
    } catch (error) {
      errorLogger(error);

      return messageErrorResponse({ error, lang, response });
    }
  };
