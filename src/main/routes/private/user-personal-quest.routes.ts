import {
  deleteUserPersonalQuestController,
  insertUserPersonalQuestController
} from '@application/controller/user-personal-quest';
import { Router } from 'express';

export default (inputRouter: Router): void => {
  const router = Router();

  router.post('/', insertUserPersonalQuestController());
  router.delete('/:id', deleteUserPersonalQuestController());

  inputRouter.use('/user-personal-quest', router);
};
