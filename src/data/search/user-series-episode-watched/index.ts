import type { UserSeriesEpisodeWatchedEntity } from '@entity/user-series-episode-watched';
import type { FindOptionsSelect } from 'typeorm';

export const userSeriesEpisodeWatchedFindParams: FindOptionsSelect<UserSeriesEpisodeWatchedEntity> =
  {
    id: true,
    score: true,

    seriesSeasonEpisodeId: true,
    userSeriesSeasonProgressId: true,
    // seriesSeasonEpisode: true,
    // userSeriesSeasonProgress: true,

    createdAt: true,
    updatedAt: true,
    finishedAt: true
  };
