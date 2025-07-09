import type { ValidationError } from 'yup';

export interface PrettyYupError {
  message: string;
  param: string | undefined;
}

export const formatYupError = (error: ValidationError): PrettyYupError[] =>
  error.inner.map((item) => ({
    message: item.message,
    param: item.path
  }));
