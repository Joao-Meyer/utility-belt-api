import { yup } from '@infra/yup';
import {
  dateNotRequired,
  numberNotRequired,
  numberRequired,
  stringNotRequired,
  stringRequired
} from '@main/utils';

export type seriesSeasonEpisodeQueryFields = 'name' | 'seasonId';

export const seriesSeasonEpisodeListQueryFields: seriesSeasonEpisodeQueryFields[] = [
  'name',
  'seasonId'
];

export const insertSeriesSeasonEpisodeSchema = yup.object().shape({
  body: yup.object().shape({
    title: stringRequired(255),
    seasonId: numberRequired().integer(),
    tmdbId: numberRequired(),
    synopsis: stringNotRequired(),
    imageUrl: stringNotRequired(),
    episodeNumber: numberRequired(),
    seasonNumber: numberRequired(),
    duration: numberRequired(),
    airedAt: dateNotRequired()
  })
});

export const updateSeriesSeasonEpisodeSchema = yup.object().shape({
  body: yup.object().shape({
    title: stringNotRequired(255),
    seasonId: numberNotRequired().integer(),
    tmdbId: numberNotRequired(),
    synopsis: stringNotRequired(),
    imageUrl: stringNotRequired(),
    episodeNumber: numberNotRequired(),
    seasonNumber: numberNotRequired(),
    duration: numberNotRequired(),
    airedAt: dateNotRequired()
  })
});
