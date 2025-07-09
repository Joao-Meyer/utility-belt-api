import {
  deleteSeriesSeasonEpisodeController,
  findOneEpisodeByTmdbIdController,
  findOneSeriesSeasonEpisodeController,
  findSeriesSeasonEpisodeController,
  insertSeriesSeasonEpisodeController,
  updateSeriesSeasonEpisodeController
} from '@application/controller/series-season-episode';
import { Router } from 'express';

export default (inputRouter: Router): void => {
  const router = Router();

  router.post('/', insertSeriesSeasonEpisodeController());
  router.get('/', findSeriesSeasonEpisodeController());
  router.get('/:id', findOneSeriesSeasonEpisodeController());
  router.get('/tmdb/:id', findOneEpisodeByTmdbIdController());
  router.put('/:id', updateSeriesSeasonEpisodeController());
  router.delete('/:id', deleteSeriesSeasonEpisodeController());

  inputRouter.use('/episode', router);
};
