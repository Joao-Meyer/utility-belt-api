import { yup } from '@infra/yup';
import { booleanNotRequired, numberNotRequired } from '@main/utils';

export const updateUserSeriesEpisodeWatchedSchema = yup.object().shape({
  body: yup.object().shape({
    watch: booleanNotRequired(),
    score: numberNotRequired()
  })
});
