import type { SeriesSeasonEpisodeEntity } from '@entity/series-season-episode';
import type { FindOptionsSelect } from 'typeorm';

export const seriesSeasonEpisodeFindParams: FindOptionsSelect<SeriesSeasonEpisodeEntity> = {
  id: true,
  airedAt: true,
  duration: true,
  episodeNumber: true,
  imageUrl: true,
  score: true,
  scoredBy: true,
  seasonNumber: true,
  synopsis: true,
  title: true,
  tmdbId: true,

  seriesSeasonId: true,
  // seriesSeason: true,

  // userSeriesEpisodeWatchedList: true,

  createdAt: true,
  updatedAt: true,
  finishedAt: true
};
