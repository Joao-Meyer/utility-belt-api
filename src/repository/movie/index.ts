import { MovieEntity } from '@entity/movie';
import { DataSource } from '@infra/database';

export const movieRepository = DataSource.getRepository(MovieEntity);
