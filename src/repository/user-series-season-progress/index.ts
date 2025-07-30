import { UserSeriesSeasonProgressEntity } from '@entity/user-series-season-progress';
import { DataSource } from '@infra/database';

export const userSeriesSeasonProgressRepository = DataSource.getRepository(
  UserSeriesSeasonProgressEntity
);
