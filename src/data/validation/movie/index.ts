import { ThemeType } from '@domain/enum';
import { yup } from '@infra/yup';
import {
  dateNotRequired,
  enumTypeRequired,
  numberNotRequired,
  numberRequired,
  stringNotRequired,
  stringRequired
} from '@main/utils';
import { array } from 'yup';

export type movieQueryFields = 'name';

export const movieListQueryFields: movieQueryFields[] = ['name'];

export const insertMovieSchema = yup.object().shape({
  body: yup.object().shape({
    title: stringRequired(255),
    originalTitle: stringRequired(255),
    imageUrl: stringRequired(),
    duration: numberRequired(),
    tmdbId: numberRequired(),
    backdropImageUrl: stringRequired(),
    homepage: stringNotRequired(),
    imdbId: stringRequired(100),
    trailerUrl: stringNotRequired(),
    trailerYoutubeId: stringNotRequired(255),
    synopsis: stringNotRequired(),
    airedAt: dateNotRequired(),
    alternativeTitleList: array().of(stringRequired()),
    categoryList: array().of(yup.object().shape({ name: stringRequired() })),
    tagList: array().of(yup.object().shape({ name: stringRequired() })),
    themeList: array().of(
      yup.object().shape({
        title: stringRequired(),
        type: enumTypeRequired({ data: ThemeType }),
        url: stringNotRequired(),
        youtubeId: stringNotRequired(),
        youtubeMusicUrl: stringNotRequired(),
        spotifyUrl: stringNotRequired(),
        order: numberNotRequired()
      })
    )
  })
});

export const updateMovieSchema = yup.object().shape({
  body: yup.object().shape({
    title: stringNotRequired(255),
    originalTitle: stringNotRequired(255),
    imageUrl: stringNotRequired(),
    duration: numberNotRequired(),
    backdropImageUrl: stringNotRequired(),
    homepage: stringNotRequired(),
    imdbId: stringNotRequired(100),
    trailerUrl: stringNotRequired(),
    trailerYoutubeId: stringNotRequired(255),
    synopsis: stringNotRequired(),
    airedAt: dateNotRequired(),
    alternativeTitleList: array().of(stringRequired())
  })
});
