import { finishedAt, getDifferentObject } from '@application/helper';
import { updateMovieSchema } from '@data/validation';
import { HistoryEntityType, HistoryType } from '@domain/enum';
import type { Controller } from '@domain/protocols';
import { EditHistoryEntity } from '@entity/edit-history';
import { MovieEntity } from '@entity/movie';
import { messages } from '@i18n/index';
import { DataSource } from '@infra/database';
import { errorLogger, messageErrorResponse, notFound, ok, toNumber } from '@main/utils';
import { movieRepository } from '@repository/movie';
import type { Request, Response } from 'express';

interface Body {
  title?: string;
  originalTitle?: string;
  imageUrl?: string;
  duration?: number;
  backdropImageUrl?: string;
  homepage?: string;
  imdbId?: string;
  trailerUrl?: string;
  trailerYoutubeId?: string;
  synopsis?: string;
  airedAt?: Date | null;
  alternativeTitleList?: string[];
}

/**
 * @typedef {object} UpdateMovieBody
 * @property {string} title
 * @property {string} originalTitle
 * @property {string} imageUrl
 * @property {number} duration
 * @property {string} backdropImageUrl
 * @property {string} homepage
 * @property {string} imdbId
 * @property {string} trailerUrl
 * @property {string} trailerYoutubeId
 * @property {string} synopsis
 * @property {string} airedAt
 * @property {array<string>} alternativeTitleList
 */

/**
 * PUT /movie/{id}
 * @summary Update Movie
 * @tags Movie
 * @security BearerAuth
 * @param {UpdateMovieBody} request.body
 * @param {integer} id.path.required
 * @return {UpdateResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {ForbiddenRequest} 403 - Forbidden response - application/json
 */
export const updateMovieController: Controller =
  () =>
  async ({ lang, ...request }: Request, response: Response) => {
    try {
      await updateMovieSchema.validate(request, { abortEarly: false });

      const {
        backdropImageUrl,
        duration,
        imageUrl,
        originalTitle,
        title,
        airedAt,
        alternativeTitleList,
        homepage,
        imdbId,
        synopsis,
        trailerUrl,
        trailerYoutubeId
      } = request.body as Body;

      const data = {
        backdropImageUrl,
        duration,
        imageUrl,
        originalTitle,
        title,
        airedAt,
        alternativeTitleList,
        homepage,
        imdbId,
        synopsis,
        trailerUrl,
        trailerYoutubeId
      };

      const movie = await movieRepository.findOne({
        select: {
          id: true,
          backdropImageUrl: true,
          duration: true,
          imageUrl: true,
          originalTitle: true,
          title: true,
          airedAt: true,
          alternativeTitleList: true,
          homepage: true,
          imdbId: true,
          synopsis: true,
          trailerUrl: true,
          trailerYoutubeId: true
        },
        where: { id: toNumber(request.params.id), finishedAt }
      });

      if (!movie) return notFound({ entity: messages[lang].entity.movie, lang, response });

      await DataSource.transaction(async (manager) => {
        const { oldData, newData } = getDifferentObject(movie, data);

        if (Object.keys(newData).length === 0) return;

        await manager.update(MovieEntity, { id: movie.id }, newData);

        await manager.insert(EditHistoryEntity, {
          userId: request.user.id,
          entityType: HistoryEntityType.MOVIE,
          type: HistoryType.UPDATE,
          entityId: movie.id,
          oldData,
          newData
        });
      });

      return ok({ payload: messages[lang].default.successfullyUpdated, lang, response });
    } catch (error) {
      errorLogger(error);

      return messageErrorResponse({ error, lang, response });
    }
  };
