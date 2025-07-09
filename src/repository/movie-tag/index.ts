import { MovieTagEntity } from '@entity/movie-tag';
import { DataSource } from '@infra/database';

export const movieTagRepository = DataSource.getRepository(MovieTagEntity);
