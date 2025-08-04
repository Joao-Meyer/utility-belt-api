import { yup } from '@infra/yup';
import { booleanNotRequired, booleanRequired, numberRequired } from '@main/utils';
import { array } from 'yup';

export const updateMultipleUserSeriesSeasonProgressSchema = yup.object().shape({
  body: yup.object().shape({
    watch: booleanRequired(),
    seasons: array().of(
      yup.object().shape({
        id: numberRequired().integer()
      })
    ),
    allSeason: booleanNotRequired()
  })
});
