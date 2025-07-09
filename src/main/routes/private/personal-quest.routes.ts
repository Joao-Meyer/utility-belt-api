import {
  deletePersonalQuestController,
  findOnePersonalQuestController,
  findPersonalQuestController,
  findPersonalQuestUserProgressController,
  insertPersonalQuestController,
  updatePersonalQuestController
} from '@application/controller/personal-quest';
import { Router } from 'express';

export default (inputRouter: Router): void => {
  const router = Router();

  router.post('/', insertPersonalQuestController());
  router.get('/', findPersonalQuestController());
  router.get('/user-progress', findPersonalQuestUserProgressController());
  router.get('/:id', findOnePersonalQuestController());
  router.put('/:id', updatePersonalQuestController());
  router.delete('/:id', deletePersonalQuestController());

  inputRouter.use('/personal-quest', router);
};
