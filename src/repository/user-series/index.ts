import { UserSeriesEntity } from '@entity/user-series';
import { DataSource } from '@infra/database';

export const userSeriesRepository = DataSource.getRepository(UserSeriesEntity);
