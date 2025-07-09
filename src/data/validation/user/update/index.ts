import { yup } from '@infra/yup';
import { stringNotRequired } from '@main/utils';

export const updateUserSchema = yup.object().shape({
  body: yup.object().shape({
    username: stringNotRequired(255),
    name: stringNotRequired(255),
    password: stringNotRequired().min(8),
    avatarUrl: stringNotRequired()
  })
});
