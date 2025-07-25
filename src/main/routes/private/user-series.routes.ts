import {
  deleteUserSeriesController,
  findOneUserSeriesController,
  findUserSeriesController,
  upsertMultipleUserSeriesController,
  upsertUserSeriesController
} from '@application/controller/user-series';
import { Router } from 'express';

export default (inputRouter: Router): void => {
  const router = Router();

  router.get('/', findUserSeriesController());
  router.post('/', upsertMultipleUserSeriesController());
  router.get('/:seriesId', findOneUserSeriesController());
  router.post('/:seriesId', upsertUserSeriesController());
  router.delete('/:seriesId', deleteUserSeriesController());

  inputRouter.use('/user-series', router);
};
