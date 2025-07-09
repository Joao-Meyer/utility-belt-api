import { yup } from '@infra/yup';
import { numberRequired, stringRequired } from '@main/utils';

export const insertUserQuestSchema = yup.object().shape({
  body: yup.object().shape({
    questId: numberRequired().integer(),
    day: stringRequired(10)
  })
});
