import { movieFindParams, seriesFindParams, tagFindParams } from '@data/search';
import type { tagQueryFields } from '@data/validation';
import { tagListQueryFields } from '@data/validation';
import type { Controller } from '@domain/protocols';
import { MovieEntity } from '@entity/movie';
import { SeriesEntity } from '@entity/series';
import { TagEntity } from '@entity/tag';
import {
  errorLogger,
  getGenericFilter,
  getPagination,
  messageErrorResponse,
  ok
} from '@main/utils';
import { movieRepository } from '@repository/movie';
import { seriesRepository } from '@repository/series';
import { tagRepository } from '@repository/tag';
import type { Request, Response } from 'express';

/**
 * @typedef {object} FindTagPayload
 * @property {array<Tag>} content
 * @property {number} totalElements
 * @property {number} totalPages
 */

/**
 * @typedef {object} FindTagResponse
 * @property {string} message
 * @property {string} status
 * @property {FindTagPayload} payload
 */

/**
 * GET /tag
 * @summary Find Tag
 * @tags Tag
 * @security BearerAuth
 * @param {string} name.query
 * @param {integer} seriesQuantity.query
 * @param {integer} movieQuantity.query
 * @param {integer} page.query
 * @param {integer} limit.query
 * @param {string} orderBy.query - enum:name,totalItems,itemsRate,createdAt
 * @param {string} sort.query - enum:asc,desc
 * @return {FindTagResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 */
export const findTagController: Controller =
  () =>
  async ({ query, lang }: Request, response: Response) => {
    try {
      const { skip, take } = getPagination({ query });

      const seriesQuantity = Number(query.seriesQuantity) || 0;
      const movieQuantity = Number(query.movieQuantity) || 0;

      const { orderBy: order, where } = getGenericFilter<tagQueryFields>({
        list: tagListQueryFields,
        query
      });

      const [categories, totalElements] = await tagRepository.findAndCount({
        order,
        select: tagFindParams,
        skip,
        take,
        where
      });

      type ContentProps = TagEntity & { movieList: MovieEntity[]; seriesList: SeriesEntity[] };

      const content: ContentProps[] = categories.map((item) => {
        return { ...item, movieList: [], seriesList: [] };
      });

      if (seriesQuantity > 0 || movieQuantity > 0)
        await Promise.all(
          content.map(async (tag) => {
            const promises: Promise<void>[] = [];

            if (seriesQuantity > 0) {
              promises.push(
                seriesRepository
                  .find({
                    select: seriesFindParams,
                    take: seriesQuantity,
                    relations: { seriesTagList: true },
                    where: { seriesTagList: { tagId: tag.id } },
                    order: { score: 'DESC' }
                  })
                  .then((seriesList) => {
                    tag.seriesList = seriesList;
                  })
              );
            }

            if (movieQuantity > 0) {
              promises.push(
                movieRepository
                  .find({
                    select: movieFindParams,
                    take: movieQuantity,
                    relations: { movieTagList: true },
                    where: { movieTagList: { tagId: tag.id } },
                    order: { score: 'DESC' }
                  })
                  .then((movieList) => {
                    tag.movieList = movieList;
                  })
              );
            }

            await Promise.all(promises);
          })
        );

      return ok({
        payload: {
          content: content.filter((tag) => {
            if (movieQuantity > 0 && seriesQuantity > 0)
              return tag.movieList?.length > 0 || tag.seriesList?.length > 0;
            else if (movieQuantity > 0) return tag.movieList?.length > 0;
            else if (seriesQuantity > 0) return tag.seriesList?.length > 0;

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
