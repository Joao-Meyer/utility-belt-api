import { yup } from '@infra/yup';
import { stringNotRequired } from '@main/utils';

export const updateUserQuestSchema = yup.object().shape({
  body: yup.object().shape({
    name: stringNotRequired(100),
    description: stringNotRequired()
  })
});
