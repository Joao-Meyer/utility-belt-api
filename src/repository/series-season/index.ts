import { SeriesSeasonEntity } from '@entity/series-season';
import { DataSource } from '@infra/database';

export const seriesSeasonRepository = DataSource.getRepository(SeriesSeasonEntity);
