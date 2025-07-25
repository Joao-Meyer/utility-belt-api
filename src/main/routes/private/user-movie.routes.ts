import {
  deleteUserMovieController,
  findOneUserMovieController,
  findUserMovieController,
  upsertMultipleUserMovieController,
  upsertUserMovieController
} from '@application/controller/user-movie';
import { Router } from 'express';

export default (inputRouter: Router): void => {
  const router = Router();

  router.get('/', findUserMovieController());
  router.post('/', upsertMultipleUserMovieController());
  router.get('/:movieId', findOneUserMovieController());
  router.post('/:movieId', upsertUserMovieController());
  router.delete('/:movieId', deleteUserMovieController());

  inputRouter.use('/user-movie', router);
};
