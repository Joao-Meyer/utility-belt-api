import type { ThemeEntity } from '@entity/theme';
import type { FindOptionsSelect } from 'typeorm';

export const themeFindParams: FindOptionsSelect<ThemeEntity> = {
  id: true,
  spotifyUrl: true,
  title: true,
  type: true,
  url: true,
  youtubeMusicUrl: true,
  youtubeId: true,
  order: true,

  // movie: true,
  movieId: true,

  // playlist: true,
  playlistId: true,

  // series: true,
  seriesId: true,

  // seriesSeason: true,
  seriesSeasonId: true,

  createdAt: true,
  updatedAt: true,
  finishedAt: true
};
