import type { UserMovieEntity } from '@entity/user-movie';
import type { FindOptionsSelect } from 'typeorm';

export const userMovieFindParams: FindOptionsSelect<UserMovieEntity> = {
  id: true,
  favorite: true,
  score: true,
  watchStatus: true,
  watchStatusOrder: true,

  // movie: true,
  // user: true,
  movieId: true,
  userId: true,

  createdAt: true,
  updatedAt: true,
  finishedAt: true
};
