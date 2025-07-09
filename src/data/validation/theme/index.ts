import { ThemeType } from '@domain/enum';
import { yup } from '@infra/yup';
import {
  enumTypeNotRequired,
  enumTypeRequired,
  numberNotRequired,
  stringNotRequired,
  stringRequired
} from '@main/utils';

export type themeQueryFields = 'name';

export const themeListQueryFields: themeQueryFields[] = ['name'];

export const insertThemeSchema = yup.object().shape({
  body: yup.object().shape({
    title: stringRequired(255),
    type: enumTypeRequired({ data: ThemeType }),
    url: stringNotRequired(),
    youtubeMusicUrl: stringNotRequired(),
    spotifyUrl: stringNotRequired(),
    youtubeId: stringNotRequired(),
    movieId: numberNotRequired().integer(),
    seriesId: numberNotRequired().integer(),
    seriesSeasonId: numberNotRequired().integer(),
    playlistId: numberNotRequired().integer(),
    order: numberNotRequired().integer()
  })
});

export const updateThemeSchema = yup.object().shape({
  body: yup.object().shape({
    title: stringNotRequired(255),
    type: enumTypeNotRequired({ data: ThemeType }),
    url: stringNotRequired(),
    youtubeMusicUrl: stringNotRequired(),
    spotifyUrl: stringNotRequired(),
    youtubeId: stringNotRequired(),
    movieId: numberNotRequired().integer(),
    seriesId: numberNotRequired().integer(),
    seriesSeasonId: numberNotRequired().integer(),
    playlistId: numberNotRequired().integer(),
    order: numberNotRequired().integer()
  })
});
