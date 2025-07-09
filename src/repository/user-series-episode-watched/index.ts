import { UserSeriesEpisodeWatchedEntity } from '@entity/user-series-episode-watched';
import { DataSource } from '@infra/database';

export const userSeriesEpisodeWatchedRepository = DataSource.getRepository(
  UserSeriesEpisodeWatchedEntity
);
