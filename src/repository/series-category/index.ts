import { SeriesCategoryEntity } from '@entity/series-category';
import { DataSource } from '@infra/database';

export const seriesCategoryRepository = DataSource.getRepository(SeriesCategoryEntity);
