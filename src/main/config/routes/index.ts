import { api } from '@domain/helpers';
import { langMiddleware } from '@main/middleware';
import { validateUserMiddleware } from '@main/middleware/validation';
import type { Express } from 'express';
import { Router } from 'express';
import { readdirSync } from 'fs';
import { join } from 'path';

export const setupRoutes = (app: Express): void => {
  const publicRouter = Router();
  const privateRouter = Router();

  readdirSync(join(__dirname, '..', '..', 'routes', 'public')).forEach(async (file) => {
    (await import(`../../routes/public/${file}`)).default(publicRouter);
  });

  readdirSync(join(__dirname, '..', '..', 'routes', 'private')).forEach(async (file) =>
    (await import(`../../routes/private/${file}`)).default(privateRouter)
  );

  app.use(langMiddleware());
  app.use(api.baseUrl, langMiddleware());

  app.use(api.baseUrl, publicRouter);

  app.use(api.baseUrl, validateUserMiddleware());
  app.use(api.baseUrl, privateRouter);

  app.get('*', (req, res) => {
    res.json({
      message: 'Api running successfully (◡‿◡)'
    });
  });
};
