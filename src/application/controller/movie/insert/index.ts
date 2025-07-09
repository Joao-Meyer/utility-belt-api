import { upsertCategory, upsertTag } from '@application/helper';
import { insertMovieSchema } from '@data/validation';
import { HistoryEntityType, HistoryType } from '@domain/enum';
import type { Controller } from '@domain/protocols';
import { EditHistoryEntity } from '@entity/edit-history';
import { MovieEntity } from '@entity/movie';
import { MovieCategoryEntity } from '@entity/movie-category';
import { MovieTagEntity } from '@entity/movie-tag';
import { ThemeEntity } from '@entity/theme';
import { DataSource } from '@infra/database';
import { created, errorLogger, insertId, messageErrorResponse } from '@main/utils';
import type { Request, Response } from 'express';

interface Body {
  title: string;
  originalTitle: string;
  imageUrl: string;
  duration: number;
  backdropImageUrl: string;
  homepage?: string;
  imdbId?: string;
  trailerUrl?: string;
  trailerYoutubeId?: string;
  tmdbId: number;
  synopsis?: string;
  airedAt?: Date | null;
  alternativeTitleList?: string[];
  categoryList?: { name: string }[];
  tagList?: { name: string }[];
  themeList?: Partial<ThemeEntity>[];
}

/**
 * @typedef {object} InsertMovieBody
 * @property {string} title.required
 * @property {string} originalTitle.required
 * @property {string} imageUrl.required
 * @property {number} duration.required
 * @property {string} backdropImageUrl.required
 * @property {number} tmdbId.required
 * @property {string} homepage
 * @property {string} imdbId
 * @property {string} trailerUrl
 * @property {string} trailerYoutubeId
 * @property {string} synopsis
 * @property {string} airedAt
 * @property {array<string>} alternativeTitleList
 * @property {array<InsertCategoryBody>} categoryList.required
 * @property {array<InsertCategoryBody>} tagList.required
 * @property {array<InsertThemeBody>} themeList.required
 */

/**
 * POST /movie
 * @summary Insert Movie
 * @tags Movie
 * @security BearerAuth
 * @param {InsertMovieBody} request.body.required
 * @return {CreatedResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 */
export const insertMovieController: Controller =
  () =>
  async ({ lang, ...request }: Request, response: Response) => {
    try {
      await insertMovieSchema.validate(request, { abortEarly: false });
      let movie;
      const {
        title,
        alternativeTitleList,
        backdropImageUrl,
        categoryList,
        duration,
        imageUrl,
        originalTitle,
        tagList,
        themeList,
        tmdbId,
        airedAt,
        homepage,
        imdbId,
        synopsis,
        trailerUrl,
        trailerYoutubeId
      } = request.body as Body;

      await DataSource.transaction(async (manager) => {
        const movieId = insertId(
          await manager.insert(MovieEntity, {
            title,
            backdropImageUrl,
            duration,
            imageUrl,
            originalTitle,
            airedAt,
            tmdbId,
            homepage,
            imdbId,
            alternativeTitleList: alternativeTitleList ?? [],
            synopsis,
            trailerUrl,
            trailerYoutubeId
          })
        );

        movie = movieId;

        if (categoryList?.length) {
          const categoryIds = await upsertCategory(manager, categoryList);

          const movieCategories: Partial<MovieCategoryEntity>[] = categoryIds.map((item) => ({
            category: { id: item },
            movie: { id: movieId }
          })) as MovieCategoryEntity[];

          await manager.insert(MovieCategoryEntity, movieCategories);
        }

        if (tagList?.length) {
          const tagIds = await upsertTag(manager, tagList);

          const movieTags: Partial<MovieTagEntity>[] = tagIds.map((item) => ({
            tag: { id: item },
            movie: { id: movieId }
          })) as MovieTagEntity[];

          await manager.insert(MovieTagEntity, movieTags);
        }

        if (themeList?.length)
          await manager.insert(
            ThemeEntity,
            themeList.map(
              ({ title, type, url, youtubeId, spotifyUrl, youtubeMusicUrl, order }) => ({
                title,
                type,
                url,
                spotifyUrl,
                youtubeId,
                youtubeMusicUrl,
                order,
                movie: { id: movieId }
              })
            )
          );

        await manager.insert(EditHistoryEntity, {
          userId: request.user.id,
          entityType: HistoryEntityType.MOVIE,
          type: HistoryType.INSERT,
          entityId: movieId,
          oldData: null,
          newData: {
            title,
            alternativeTitleList,
            backdropImageUrl,
            duration,
            imageUrl,
            originalTitle,
            airedAt,
            homepage,
            imdbId,
            synopsis,
            trailerUrl,
            trailerYoutubeId,
            categoryList,
            tagList,
            themeList
          }
        });
      });

      return created({ response, payload: { id: movie }, lang });
    } catch (error) {
      errorLogger(error);

      return messageErrorResponse({ error, lang, response });
    }
  };
