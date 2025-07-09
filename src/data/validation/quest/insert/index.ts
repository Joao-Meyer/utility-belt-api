import { yup } from '@infra/yup';
import { stringNotRequired, stringRequired } from '@main/utils';

export const insertQuestSchema = yup.object().shape({
  body: yup.object().shape({
    name: stringRequired(255),
    description: stringNotRequired()
  })
});
