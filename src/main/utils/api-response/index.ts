import { Langs } from '@domain/enum';
import { statusCodeList } from '@domain/helpers';
import { messages } from '@i18n/index';
import { formatYupError } from '@main/utils/yup-resolver-errors';
import type { Response } from 'express';
import { QueryFailedError } from 'typeorm';
import { ValidationError } from 'yup';

export const created = ({
  response,
  lang,
  payload
}: {
  response: Response;
  lang: Langs;
  payload?: unknown;
}): Response => {
  return response.status(statusCodeList.CREATED).json({
    errors: [],
    message: messages[lang].default.ok,
    payload: payload || messages[lang].default.successfullyCreated,
    status: 'request successfully'
  });
};

export const ok = ({
  response,
  lang,
  payload
}: {
  response: Response;
  lang: Langs;
  payload?: unknown;
}): Response =>
  response.status(statusCodeList.OK).json({
    errors: [],
    message: messages[lang].default.ok,
    payload,
    status: 'request successfully'
  });

export const badRequest = ({
  response,
  message,
  errors = [],
  lang,
  payload = {}
}: {
  response: Response;
  message?: unknown;
  lang: Langs;
  errors?: unknown;
  payload?: object;
}): Response =>
  response.status(statusCodeList.BAD_REQUEST).json({
    errors,
    message: message || messages[lang].error.badRequest,
    payload,
    status: 'bad request'
  });

export const notFound = ({
  entity,
  response,
  message,
  payload = {},
  lang,
  errors = []
}: {
  entity: unknown;
  response: Response;
  lang: Langs;
  message?: unknown;
  payload?: object;
  errors?: unknown;
}): Response =>
  response.status(statusCodeList.NOT_FOUND).json({
    errors,
    message: message || `${entity} ${messages[lang].error.notFound}`,
    payload,
    status: 'not found'
  });

export const unauthorized = ({
  response,
  message,
  lang,
  errors = [],
  payload = {}
}: {
  response: Response;
  message?: unknown;
  lang: Langs;
  errors?: unknown;
  payload?: object;
}): Response =>
  response.status(statusCodeList.NOT_AUTHORIZED).json({
    errors,
    message: message || messages[lang].error.unauthorized,
    payload,
    status: 'unauthorized'
  });

export const forbidden = ({
  response,
  message,
  lang,
  errors = [],
  payload = {}
}: {
  response: Response;
  message?: unknown;
  lang: Langs;
  errors?: unknown;
  payload?: unknown;
}): Response =>
  response.status(statusCodeList.FORBIDDEN).json({
    errors,
    message: message || messages[lang].error.notPermission,
    payload,
    status: 'forbidden'
  });

export const timeout = ({
  response,
  message,
  lang,
  errors = [],
  payload = {}
}: {
  response: Response;
  message?: unknown;
  errors?: unknown;
  lang: Langs;
  payload?: object;
}): Response =>
  response.status(statusCodeList.TIMEOUT).json({
    errors,
    message: message || messages[lang].error.timeout,
    payload,
    status: 'timeout'
  });

export const messageErrorResponse = ({
  error,
  lang,
  response
}: {
  error: unknown;
  lang: Langs;
  response: Response;
}): Response => {
  if (error instanceof ValidationError) return validationErrorResponse({ error, lang, response });

  if (error instanceof QueryFailedError) {
    const err = error as unknown as { code?: string; constraint?: 'none' };

    if (err?.code === '23505') {
      const errorMessage = error?.driverError?.detail ?? '';

      const match = errorMessage?.match(/\(([^)]+)\)/);
      let key = match ? match[1] : 'none';

      if (messages[lang].key[key as 'none']) key = messages[lang].key[key as 'none'];

      return badRequest({
        message: `${messages[lang].error.duplicateKey} ${key} ${messages[lang].error.isAlreadyInUse}`,
        response,
        lang,
        errors: error
      });
    }
  }

  return badRequest({
    message: messages[lang].error.internalServerError,
    response,
    lang,
    errors: error
  });
};

export const validationErrorResponse = ({
  error,
  lang,
  response
}: {
  error: ValidationError;
  lang: Langs;
  response: Response;
}): Response =>
  badRequest({
    errors: formatYupError(error),
    message: messages[lang].error.validationErrorResponse,
    response,
    lang
  });
