import {
  deleteSeriesSeasonController,
  findOneSeasonByTmdbIdController,
  findOneSeriesSeasonController,
  findSeriesSeasonController,
  insertSeriesSeasonController,
  updateSeriesSeasonController
} from '@application/controller/series-season';
import { Router } from 'express';

export default (inputRouter: Router): void => {
  const router = Router();

  router.post('/', insertSeriesSeasonController());
  router.get('/', findSeriesSeasonController());
  router.get('/:id', findOneSeriesSeasonController());
  router.get('/tmdb/:id', findOneSeasonByTmdbIdController());
  router.put('/:id', updateSeriesSeasonController());
  router.delete('/:id', deleteSeriesSeasonController());

  inputRouter.use('/season', router);
};
