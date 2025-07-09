import {
  deleteTagController,
  findTagController,
  insertTagController,
  updateTagController
} from '@application/controller/tag';
import { Router } from 'express';

export default (inputRouter: Router): void => {
  const router = Router();

  router.post('/', insertTagController());
  router.get('/', findTagController());
  router.put('/:id', updateTagController());
  router.delete('/:id', deleteTagController());

  inputRouter.use('/tag', router);
};
