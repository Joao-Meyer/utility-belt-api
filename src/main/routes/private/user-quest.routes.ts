import {
  deleteUserQuestController,
  insertUserQuestController
} from '@application/controller/user-quest';
import { Router } from 'express';

export default (inputRouter: Router): void => {
  const router = Router();

  router.post('/', insertUserQuestController());
  router.delete('/:id/:day', deleteUserQuestController());

  inputRouter.use('/user-quest', router);
};
