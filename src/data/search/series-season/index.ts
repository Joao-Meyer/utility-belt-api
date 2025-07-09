import type { SeriesSeasonEntity } from '@entity/series-season';
import type { FindOptionsSelect } from 'typeorm';

export const seriesSeasonFindParams: FindOptionsSelect<SeriesSeasonEntity> = {
  id: true,
  name: true,
  airedAt: true,
  airedEndAt: true,
  imageUrl: true,
  seasonNumber: true,
  status: true,
  synopsis: true,
  totalEpisodes: true,
  tmdbId: true,

  // series: true,
  seriesId: true,

  // seriesSeasonEpisodeList: true,
  // themeList: true,
  // userSeriesSeasonProgressList: true,

  createdAt: true,
  updatedAt: true,
  finishedAt: true
};
