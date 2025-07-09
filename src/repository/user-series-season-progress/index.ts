import { UserSeriesSeasonProgressEntity } from '@entity/user-series-season-progress';
import { DataSource } from '@infra/database';

export const userSeriesSeasonProgressEntityRepository = DataSource.getRepository(
  UserSeriesSeasonProgressEntity
);
