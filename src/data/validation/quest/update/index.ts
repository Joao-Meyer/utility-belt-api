import { yup } from '@infra/yup';
import { stringNotRequired } from '@main/utils';

export const updateQuestSchema = yup.object().shape({
  body: yup.object().shape({
    name: stringNotRequired(255),
    description: stringNotRequired()
  })
});
