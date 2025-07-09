import {
  deleteQuestController,
  findOneQuestController,
  findQuestController,
  findQuestUserProgressController,
  findQuestUserRankingController,
  insertQuestController,
  updateQuestController
} from '@application/controller/quest';
import { Router } from 'express';

export default (inputRouter: Router): void => {
  const router = Router();

  router.post('/', insertQuestController());
  router.get('/', findQuestController());
  router.get('/user-progress', findQuestUserProgressController());
  router.get('/user-ranking', findQuestUserRankingController());
  router.get('/:id', findOneQuestController());
  router.put('/:id', updateQuestController());
  router.delete('/:id', deleteQuestController());

  inputRouter.use('/quest', router);
};
