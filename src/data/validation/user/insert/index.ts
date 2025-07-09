import { yup } from '@infra/yup';
import { stringRequired } from '@main/utils';

export const insertUserSchema = yup.object().shape({
  body: yup.object().shape({
    name: stringRequired(255),
    password: stringRequired(),
    username: stringRequired(255)
  })
});
