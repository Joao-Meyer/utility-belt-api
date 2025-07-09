import { SeriesTagEntity } from '@entity/series-tag';
import { DataSource } from '@infra/database';

export const seriesTagRepository = DataSource.getRepository(SeriesTagEntity);
