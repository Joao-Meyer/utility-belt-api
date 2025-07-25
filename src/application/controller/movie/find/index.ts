import { movieFindParamsQuery } from '@data/search';
import { WatchStatus } from '@domain/enum';
import type { Controller } from '@domain/protocols';
import { errorLogger, getPagination, getQueryArray, messageErrorResponse, ok } from '@main/utils';
import { movieRepository } from '@repository/movie';
import type { Request, Response } from 'express';
import { Brackets } from 'typeorm';

/**
 * @typedef {object} FindMoviePayload
 * @property {array<Movie>} content
 * @property {number} totalElements
 * @property {number} totalPages
 */

/**
 * @typedef {object} FindMovieResponse
 * @property {string} message
 * @property {string} status
 * @property {FindMoviePayload} payload
 */

/**
 * GET /movie
 * @summary Find Movies
 * @tags Movie
 * @security BearerAuth
 * @param {string} name.query
 * @param {integer} page.query
 * @param {integer} limit.query
 * @param {string} startDate.query (Ex: 2024-01-01).
 * @param {string} endDate.query (Ex: 2024-01-01).
 * @param {string} orderBy.query - enum:name,createdAt
 * @param {string} sort.query - enum:asc,desc
 * @return {FindMovieResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 */
export const findMovieController: Controller =
  () =>
  async ({ query, lang, user }: Request, response: Response) => {
    try {
      const { skip, take } = getPagination({ query });

      const categoryIds = getQueryArray(query.categoryIds);
      const tagIds = getQueryArray(query.tagIds);
      const watchStatus = getQueryArray(query.watchStatus);

      const queryBuilder = movieRepository
        .createQueryBuilder('m')
        .select(movieFindParamsQuery)
        .leftJoinAndSelect('m.userMovieList', 'um', 'um.userId = :userId', {
          userId: user.id
        })
        .orderBy(
          `m.${query?.sortBy ?? 'createdAt'}`,
          query?.sort === 'ASC' || query?.sort === 'DESC' ? query?.sort : 'ASC'
        )
        .skip(skip)
        .take(take);

      if (categoryIds?.length) {
        queryBuilder
          .leftJoin('m.movieCategoryList', 'mc')
          .andWhere('mc.categoryId IN (:...categoryIds)', {
            categoryIds: categoryIds
          });
      }

      if (tagIds?.length) {
        queryBuilder.leftJoin('m.movieTagList', 'st').andWhere('mt.tagId IN (:...tagIds)', {
          tagIds: tagIds
        });
      }

      if (watchStatus?.filter((item) => item !== WatchStatus.NONE)?.length) {
        queryBuilder.andWhere('um.watchStatus IN (:...watchStatus)', {
          watchStatus: watchStatus?.filter((item) => item !== WatchStatus.NONE)
        });
      }

      if (watchStatus?.includes(WatchStatus.NONE)) {
        queryBuilder.andWhere('um.id IS NULL OR um.watchStatus = :noneStatus', {
          noneStatus: 'NONE'
        });
      }
      if (query?.search) {
        const searchTerm = `%${query.search}%`;

        queryBuilder.andWhere(
          new Brackets((qb) => {
            qb.where('m.title ILIKE :searchTerm', { searchTerm })
              .orWhere('m.originalTitle ILIKE :searchTerm', { searchTerm })
              .orWhere('m.synopsis ILIKE :searchTerm', { searchTerm })
              .orWhere(
                `EXISTS (
                SELECT 1 FROM unnest(m.alternativeTitleList) alt
                WHERE alt ILIKE :searchTerm
              )`,
                { searchTerm }
              );
          })
        );
      }

      const [content, totalElements] = await queryBuilder.getManyAndCount();

      const formattedContent = content.map((movie) => {
        const { userMovieList, ...data } = movie;
        return {
          ...data,
          userMovie: userMovieList?.[0] ?? null
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
      console.log(error);

      errorLogger(error);

      return messageErrorResponse({ error, lang, response });
    }
  };
