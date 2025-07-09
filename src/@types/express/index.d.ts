import { Langs } from '@domain/enum';
import type { RequestUser } from '@domain/token';

declare global {
  namespace Express {
    interface Request {
      user: RequestUser;
      lang: Langs;
    }
  }
}
