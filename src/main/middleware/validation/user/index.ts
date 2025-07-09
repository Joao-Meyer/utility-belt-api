import { finishedAt } from '@application/helper';
import { userFindParams } from '@data/search';
import type { Controller } from '@domain/protocols';
import type { UserTokenInput } from '@domain/token';
import { env } from '@main/config/env';
import { errorLogger, removeBearer, unauthorized } from '@main/utils';
import { userRepository } from '@repository/user';
import type { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

export const validateUserMiddleware: Controller =
  () => async (request: Request, response: Response, next: NextFunction) => {
    const { lang } = request;
    try {
      const { authorization } = request.headers;

      if (typeof authorization === 'undefined') return unauthorized({ lang, response });

      const accessToken = removeBearer(authorization);

      if (accessToken === null) return unauthorized({ lang, response });

      const { SECRET } = env.JWT;
      const { username, id } = verify(accessToken, SECRET) as UserTokenInput;

      if (typeof id === 'undefined' || typeof username === 'undefined')
        return unauthorized({ lang, response });

      const user = await userRepository.findOne({
        select: userFindParams,
        where: { id, username, finishedAt }
      });

      if (user === null) return unauthorized({ lang, response });

      Object.assign(request, { user });
      next();
    } catch (error) {
      errorLogger(error);

      return unauthorized({ lang, response });
    }
  };
