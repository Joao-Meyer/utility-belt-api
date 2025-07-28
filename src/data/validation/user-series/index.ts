import { WatchStatus } from '@domain/enum';
import { yup } from '@infra/yup';
import {
  booleanNotRequired,
  enumTypeNotRequired,
  numberNotRequired,
  numberRequired
} from '@main/utils';
import { array } from 'yup';

export type userSeriesQueryFields = 'name';

export const userSeriesListQueryFields: userSeriesQueryFields[] = ['name'];

export const updateUserSeriesSchema = yup.object().shape({
  body: yup.object().shape({
    favorite: booleanNotRequired(),
    watchStatus: enumTypeNotRequired({ data: WatchStatus }),
    score: numberNotRequired()
  })
});

export const updateMultipleUserSeriesSchema = yup.object().shape({
  body: yup.object().shape({
    series: array().of(
      yup.object().shape({
        id: numberRequired().integer(),
        favorite: booleanNotRequired(),
        watchStatus: enumTypeNotRequired({ data: WatchStatus }),
        score: numberNotRequired()
      })
    )
  })
});
