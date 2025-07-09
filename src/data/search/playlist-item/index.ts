import type { PlaylistItemEntity } from '@entity/playlist-item';
import type { FindOptionsSelect } from 'typeorm';
import { movieFindParams } from '../movie';
import { seriesFindParams } from '../series';

export const playlistItemFindParams: FindOptionsSelect<PlaylistItemEntity> = {
  id: true,
  order: true,

  movie: movieFindParams,
  movieId: true,
  series: seriesFindParams,
  seriesId: true,

  playlistId: true,
  // playlist: true,

  createdAt: true,
  updatedAt: true,
  finishedAt: true
};
