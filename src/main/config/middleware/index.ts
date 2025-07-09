import {
  bodyParser,
  contentType,
  staticFolder,
  staticRoute,
  urlEncodedParser
} from '@main/middleware';
import type { Express } from 'express';

export const setupMiddleware = (app: Express): void => {
  app.use(bodyParser);
  app.use(urlEncodedParser);
  app.use(contentType);
  app.use(staticRoute, staticFolder);
};
