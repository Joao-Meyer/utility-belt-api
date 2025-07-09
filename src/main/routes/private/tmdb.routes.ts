import {
  findMovieByIdTMDBController,
  findSeasonTMDBController,
  findSeriesByIdTMDBController,
  searchTMDBController
} from '@application/controller/tmdb';
import { Router } from 'express';

export default (inputRouter: Router): void => {
  const router = Router();

  router.get('/movie/:movieId', findMovieByIdTMDBController());
  router.get('/series/:seriesId', findSeriesByIdTMDBController());
  router.get('/series/:seriesId/season/:seasonNumber', findSeasonTMDBController());
  router.get('/search', searchTMDBController());

  inputRouter.use('/tmdb', router);
};
