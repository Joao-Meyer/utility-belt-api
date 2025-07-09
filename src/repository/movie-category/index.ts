import { MovieCategoryEntity } from '@entity/movie-category';
import { DataSource } from '@infra/database';

export const movieCategoryRepository = DataSource.getRepository(MovieCategoryEntity);
