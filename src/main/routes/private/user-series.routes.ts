import {
  deleteUserSeriesController,
  findOneUserSeriesController,
  findUserSeriesController,
  upsertMultipleUserSeriesController,
  upsertUserSeriesController
} from '@application/controller/user-series';
import { upsertMultipleUserSeriesEpisodeWatchedController } from '@application/controller/user-series-episode-watched';
import { upsertMultipleUserSeriesSeasonProgressController } from '@application/controller/user-series-season-progress';
import { Router } from 'express';

export default (inputRouter: Router): void => {
  const router = Router();

  router.get('/', findUserSeriesController());
  router.post('/', upsertMultipleUserSeriesController());
  router.get('/:seriesId', findOneUserSeriesController());

  router.post('/:seriesId/season-progress', upsertMultipleUserSeriesSeasonProgressController());
  router.post(
    '/:seriesId/season/:seasonId/episode-watched',
    upsertMultipleUserSeriesEpisodeWatchedController()
  );

  router.post('/:seriesId', upsertUserSeriesController());
  router.delete('/:seriesId', deleteUserSeriesController());

  inputRouter.use('/user-series', router);
};
