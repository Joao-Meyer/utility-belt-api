import type { Controller } from '@domain/protocols';
import type { NextFunction, Request, Response } from 'express';

export const langMiddleware: Controller =
  () => async (request: Request, response: Response, next: NextFunction) => {
    Object.assign(request, { lang: 'pt' });
    next();
  };
