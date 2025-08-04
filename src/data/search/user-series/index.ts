import type { UserSeriesEntity } from '@entity/user-series';
import type { FindOptionsSelect } from 'typeorm';

export const userSeriesFindParams: FindOptionsSelect<UserSeriesEntity> = {
  id: true,
  favorite: true,
  score: true,
  watchStatus: true,
  watchStatusOrder: true,
  totalSeasonWatched: true,

  seriesId: true,
  userId: true,
  // series: true,
  // user: true,

  // userSeriesSeasonProgressList: true,

  createdAt: true,
  updatedAt: true,
  finishedAt: true
};
