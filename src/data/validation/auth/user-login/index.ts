import { yup } from '@infra/yup';
import { emailRequired, stringRequired } from '@main/utils';

export const authenticateSchema = yup.object().shape({
  body: yup.object().shape({
    email: emailRequired(),
    password: stringRequired()
  })
});
