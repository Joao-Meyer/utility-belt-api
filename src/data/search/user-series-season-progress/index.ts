import type { UserSeriesSeasonProgressEntity } from '@entity/user-series-season-progress';
import type { FindOptionsSelect } from 'typeorm';

export const userSeriesSeasonProgressFindParams: FindOptionsSelect<UserSeriesSeasonProgressEntity> =
  {
    id: true,
    watchStatus: true,

    userId: true,
    seriesSeasonId: true,
    userSeriesId: true,
    // seriesSeason: true,
    // userSeries: true,

    // userSeriesEpisodeWatchedList: true,

    createdAt: true,
    updatedAt: true,
    finishedAt: true
  };
