import { insertUserController } from '@application/controller/user';
import { Router } from 'express';

export default (inputRouter: Router): void => {
  const router = Router();

  router.post('/', insertUserController());

  router.get('/teste', async (req, res) => {
    res.json({ a: 'a' });
  });

  inputRouter.use('/user', router);
};
