import { SeriesEntity } from '@entity/series';
import { DataSource } from '@infra/database';

export const seriesRepository = DataSource.getRepository(SeriesEntity);
