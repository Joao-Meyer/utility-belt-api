import type { SeriesEntity } from '@entity/series';
import { findParamsToSelect } from '@main/utils/find-params-to-select';
import type { FindOptionsSelect } from 'typeorm';
import { userSeriesFindParams } from '../user-series';

export const seriesFindParams: FindOptionsSelect<SeriesEntity> = {
  id: true,
  airedAt: true,
  airedEndAt: true,
  backdropImageUrl: true,
  homepage: true,
  imageUrl: true,
  imdbId: true,
  originalTitle: true,
  rank: true,
  releaseStatus: true,
  tmdbId: true,
  score: true,
  scoredBy: true,
  synopsis: true,
  title: true,
  totalEpisodes: true,
  totalFavorites: true,
  totalSeasons: true,
  totalWatch: true,
  trailerUrl: true,
  trailerYoutubeId: true,

  alternativeTitleList: true,

  // userSeriesList: true,
  // playlistItemList: true,
  // seriesCategoryList: true,
  // seriesSeasonList: true,
  // seriesTagList: true,
  // themeList: true,

  createdAt: true,
  updatedAt: true,
  finishedAt: true
};

export const seriesFindParamsQuery = findParamsToSelect([
  [seriesFindParams, 's'],
  [userSeriesFindParams, 'us']
]);
