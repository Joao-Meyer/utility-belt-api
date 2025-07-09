import { SeasonStatus, ThemeType } from '@domain/enum';
import { yup } from '@infra/yup';
import {
  dateNotRequired,
  enumTypeNotRequired,
  enumTypeRequired,
  numberNotRequired,
  numberRequired,
  stringNotRequired,
  stringRequired
} from '@main/utils';
import { array } from 'yup';

export type seriesSeasonQueryFields = 'name' | 'seriesId';

export const seriesSeasonListQueryFields: seriesSeasonQueryFields[] = ['name', 'seriesId'];

const themeListSchema = array().of(
  yup.object().shape({
    title: stringRequired(),
    type: enumTypeRequired({ data: ThemeType }),
    url: stringNotRequired(),
    youtubeId: stringNotRequired(),
    youtubeMusicUrl: stringNotRequired(),
    spotifyUrl: stringNotRequired(),
    order: numberNotRequired()
  })
);

const episodeListSchema = array().of(
  yup.object().shape({
    title: stringRequired(255),
    synopsis: stringNotRequired(),
    imageUrl: stringRequired(),
    episodeNumber: numberRequired(),
    tmdbId: numberRequired(),
    seasonNumber: numberRequired(),
    duration: numberRequired(),
    airedAt: dateNotRequired()
  })
);

export const insertSeriesSeasonSchema = yup.object().shape({
  body: yup.object().shape({
    name: stringRequired(255),
    synopsis: stringNotRequired(),
    tmdbId: numberRequired(),
    imageUrl: stringRequired(),
    totalEpisodes: numberRequired(),
    status: enumTypeRequired({ data: SeasonStatus }),
    seasonNumber: numberRequired(),
    airedAt: dateNotRequired(),
    airedEndAt: dateNotRequired(),
    themeList: themeListSchema,
    episodeList: episodeListSchema
  })
});

export const updateSeriesSeasonSchema = yup.object().shape({
  body: yup.object().shape({
    name: stringNotRequired(255),
    synopsis: stringNotRequired(),
    imageUrl: stringNotRequired(),
    totalEpisodes: numberNotRequired(),
    status: enumTypeNotRequired({ data: SeasonStatus }),
    seasonNumber: numberNotRequired(),
    airedAt: dateNotRequired(),
    airedEndAt: dateNotRequired()
  })
});
