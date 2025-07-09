import type { MovieEntity } from '@entity/movie';
import { findParamsToSelect } from '@main/utils/find-params-to-select';
import type { FindOptionsSelect } from 'typeorm';
import { userMovieFindParams } from '../user-movie';

export const movieFindParams: FindOptionsSelect<MovieEntity> = {
  id: true,
  airedAt: true,
  backdropImageUrl: true,
  duration: true,
  homepage: true,
  imageUrl: true,
  imdbId: true,
  tmdbId: true,
  originalTitle: true,
  rank: true,
  score: true,
  scoredBy: true,
  synopsis: true,
  title: true,
  totalFavorites: true,
  totalWatch: true,
  trailerUrl: true,
  trailerYoutubeId: true,

  alternativeTitleList: true,

  // userMovieList: true,
  // themeList: true,
  // playlistItemList: true,
  // movieCategoryList: true,
  // movieTagList: true,

  createdAt: true,
  updatedAt: true,
  finishedAt: true
};

export const movieFindParamsQuery = findParamsToSelect([
  [movieFindParams, 'm'],
  [userMovieFindParams, 'um']
]);
