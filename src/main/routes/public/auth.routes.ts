import { userLoginController } from '@application/controller/auth';
import { Router } from 'express';

export default (inputRouter: Router): void => {
  const router = Router();

  router.post('/login', userLoginController());

  inputRouter.use('/auth', router);
};
