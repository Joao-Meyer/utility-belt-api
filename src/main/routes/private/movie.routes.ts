import {
  deleteMovieCategoryController,
  deleteMovieController,
  deleteMovieTagController,
  findMovieController,
  findOneMovieByTmdbIdController,
  findOneMovieController,
  insertMovieController,
  updateMovieController
} from '@application/controller/movie';
import { Router } from 'express';

export default (inputRouter: Router): void => {
  const router = Router();

  router.post('/', insertMovieController());
  router.get('/', findMovieController());
  router.get('/:id', findOneMovieController());
  router.get('/tmdb/:id', findOneMovieByTmdbIdController());
  router.put('/:id', updateMovieController());
  router.delete('/tag/:id', deleteMovieTagController());
  router.delete('/category/:id', deleteMovieCategoryController());
  router.delete('/:id', deleteMovieController());

  inputRouter.use('/movie', router);
};
