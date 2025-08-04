import { categoryFindParams, movieFindParams, seriesFindParams } from '@data/search';
import type { categoryQueryFields } from '@data/validation';
import { categoryListQueryFields } from '@data/validation';
import type { Controller } from '@domain/protocols';
import { CategoryEntity } from '@entity/category';
import { MovieEntity } from '@entity/movie';
import { SeriesEntity } from '@entity/series';
import {
  errorLogger,
  getGenericFilter,
  getPagination,
  messageErrorResponse,
  ok
} from '@main/utils';
import { categoryRepository } from '@repository/category';
import { movieRepository } from '@repository/movie';
import { seriesRepository } from '@repository/series';
import type { Request, Response } from 'express';

/**
 * @typedef {object} FindCategoryPayload
 * @property {array<Category>} content
 * @property {number} totalElements
 * @property {number} totalPages
 */

/**
 * @typedef {object} FindCategoryResponse
 * @property {string} message
 * @property {string} status
 * @property {FindCategoryPayload} payload
 */

/**
 * GET /category
 * @summary Find Category
 * @tags Category
 * @security BearerAuth
 * @param {string} name.query
 * @param {integer} seriesQuantity.query
 * @param {integer} movieQuantity.query
 * @param {integer} page.query
 * @param {integer} limit.query
 * @param {string} orderBy.query - enum:name,createdAt
 * @param {string} sort.query - enum:asc,desc
 * @return {FindCategoryResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 */
export const findCategoryController: Controller =
  () =>
  async ({ query, lang }: Request, response: Response) => {
    try {
      const { skip, take } = getPagination({ query });

      const seriesQuantity = Number(query.seriesQuantity) || 0;
      const movieQuantity = Number(query.movieQuantity) || 0;

      const { orderBy: order, where } = getGenericFilter<categoryQueryFields>({
        list: categoryListQueryFields,
        query
      });

      const [categories, totalElements] = await categoryRepository.findAndCount({
        order,
        select: categoryFindParams,
        skip,
        take,
        where
      });

      type ContentProps = CategoryEntity & { movieList: MovieEntity[]; seriesList: SeriesEntity[] };

      const content: ContentProps[] = categories.map((item) => {
        return { ...item, movieList: [], seriesList: [] };
      });

      if (seriesQuantity > 0 || movieQuantity > 0)
        await Promise.all(
          content.map(async (category) => {
            const promises: Promise<void>[] = [];

            if (seriesQuantity > 0) {
              promises.push(
                seriesRepository
                  .find({
                    select: seriesFindParams,
                    take: seriesQuantity,
                    relations: { seriesCategoryList: true },
                    where: { seriesCategoryList: { categoryId: category.id } },
                    order: { score: 'DESC' }
                  })
                  .then((seriesList) => {
                    category.seriesList = seriesList;
                  })
              );
            }

            if (movieQuantity > 0) {
              promises.push(
                movieRepository
                  .find({
                    select: movieFindParams,
                    take: movieQuantity,
                    relations: { movieCategoryList: true },
                    where: { movieCategoryList: { categoryId: category.id } },
                    order: { score: 'DESC' }
                  })
                  .then((movieList) => {
                    category.movieList = movieList;
                  })
              );
            }

            await Promise.all(promises);
          })
        );

      return ok({
        payload: {
          content: content.filter((category) => {
            if (movieQuantity > 0 && seriesQuantity > 0)
              return category.movieList?.length > 0 || category.seriesList?.length > 0;
            else if (movieQuantity > 0) return category.movieList?.length > 0;
            else if (seriesQuantity > 0) return category.seriesList?.length > 0;

            return true;
          }),
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
