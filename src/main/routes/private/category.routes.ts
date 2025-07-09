import {
  deleteCategoryController,
  findCategoryController,
  insertCategoryController,
  updateCategoryController
} from '@application/controller/category';
import { Router } from 'express';

export default (inputRouter: Router): void => {
  const router = Router();

  router.post('/', insertCategoryController());
  router.get('/', findCategoryController());
  router.put('/:id', updateCategoryController());
  router.delete('/:id', deleteCategoryController());

  inputRouter.use('/category', router);
};
