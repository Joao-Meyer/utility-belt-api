import { UserMovieEntity } from '@entity/user-movie';
import { DataSource } from '@infra/database';

export const userMovieRepository = DataSource.getRepository(UserMovieEntity);
