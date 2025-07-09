import { ReleaseStatus, SeasonStatus, ThemeType } from '@domain/enum';
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

export type seriesQueryFields = 'name';

export const seriesListQueryFields: seriesQueryFields[] = ['name'];

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
    tmdbId: numberRequired(),
    episodeNumber: numberRequired(),
    seasonNumber: numberRequired(),
    duration: numberRequired(),
    airedAt: dateNotRequired()
  })
);

const seasonListSchema = array().of(
  yup.object().shape({
    name: stringRequired(255),
    synopsis: stringNotRequired(),
    imageUrl: stringRequired(),
    tmdbId: numberRequired(),
    totalEpisodes: numberRequired(),
    status: enumTypeRequired({ data: SeasonStatus }),
    seasonNumber: numberRequired(),
    airedAt: dateNotRequired(),
    airedEndAt: dateNotRequired(),
    themeList: themeListSchema,
    episodeList: episodeListSchema
  })
);

export const insertSeriesSchema = yup.object().shape({
  body: yup.object().shape({
    title: stringRequired(255),
    originalTitle: stringRequired(255),
    imageUrl: stringRequired(),
    tmdbId: numberRequired(),
    homepage: stringNotRequired(),
    releaseStatus: enumTypeRequired({ data: ReleaseStatus }),
    backdropImageUrl: stringRequired(),
    imdbId: stringNotRequired(100),
    trailerUrl: stringNotRequired(),
    trailerYoutubeId: stringNotRequired(255),
    synopsis: stringNotRequired(),
    totalEpisodes: numberRequired(),
    totalSeasons: numberRequired(),
    airedAt: dateNotRequired(),
    airedEndAt: dateNotRequired(),
    alternativeTitleList: array().of(stringRequired()),
    categoryList: array().of(yup.object().shape({ name: stringRequired() })),
    tagList: array().of(yup.object().shape({ name: stringRequired() })),
    themeList: themeListSchema,
    seasonList: seasonListSchema
  })
});

export const updateSeriesSchema = yup.object().shape({
  body: yup.object().shape({
    title: stringNotRequired(255),
    originalTitle: stringNotRequired(255),
    imageUrl: stringNotRequired(),
    homepage: stringNotRequired(),
    releaseStatus: enumTypeNotRequired({ data: ReleaseStatus }),
    backdropImageUrl: stringNotRequired(),
    imdbId: stringNotRequired(100),
    trailerUrl: stringNotRequired(),
    trailerYoutubeId: stringNotRequired(255),
    synopsis: stringNotRequired(),
    totalEpisodes: numberRequired(),
    totalSeasons: numberRequired(),
    airedAt: dateNotRequired(),
    airedEndAt: dateNotRequired(),
    alternativeTitleList: array().of(stringRequired())
  })
});
