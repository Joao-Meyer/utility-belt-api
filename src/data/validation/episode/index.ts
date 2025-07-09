import { SeasonStatus } from '@domain/enum';
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

export type seriesSeasonEpisodeQueryFields = 'name' | 'seasonId';

export const seriesSeasonEpisodeListQueryFields: seriesSeasonEpisodeQueryFields[] = [
  'name',
  'seasonId'
];

export const insertSeriesSeasonEpisodeSchema = yup.object().shape({
  body: yup.object().shape({
    name: stringRequired(255),
    synopsis: stringNotRequired(),
    imageUrl: stringRequired(),
    tmdbId: numberRequired(),
    totalEpisodes: numberRequired(),
    status: enumTypeRequired({ data: SeasonStatus }),
    seasonNumber: numberRequired(),
    airedAt: dateNotRequired(),
    airedEndAt: dateNotRequired()
  })
});

export const updateSeriesSeasonEpisodeSchema = yup.object().shape({
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
