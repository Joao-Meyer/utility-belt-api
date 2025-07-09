import {
  deleteThemeController,
  findThemeController,
  insertThemeController,
  updateThemeController
} from '@application/controller/theme';
import { Router } from 'express';

export default (inputRouter: Router): void => {
  const router = Router();

  router.post('/', insertThemeController());
  router.get('/', findThemeController());
  router.put('/:id', updateThemeController());
  router.delete('/:id', deleteThemeController());

  inputRouter.use('/theme', router);
};
