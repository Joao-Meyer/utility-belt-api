import {
  deleteSeriesCategoryController,
  deleteSeriesController,
  deleteSeriesTagController,
  findOneSeriesByTmdbIdController,
  findOneSeriesController,
  findSeriesController,
  insertSeriesController,
  updateSeriesController
} from '@application/controller/series';
import { Router } from 'express';

export default (inputRouter: Router): void => {
  const router = Router();

  router.post('/', insertSeriesController());
  router.get('/', findSeriesController());
  router.get('/:id', findOneSeriesController());
  router.get('/tmdb/:id', findOneSeriesByTmdbIdController());
  router.put('/:id', updateSeriesController());
  router.delete('/tag/:id', deleteSeriesTagController());
  router.delete('/category/:id', deleteSeriesCategoryController());
  router.delete('/:id', deleteSeriesController());

  inputRouter.use('/series', router);
};
