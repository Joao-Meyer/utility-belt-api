import { WatchStatus } from '@domain/enum';
import { yup } from '@infra/yup';
import {
  booleanNotRequired,
  enumTypeNotRequired,
  numberNotRequired,
  numberRequired
} from '@main/utils';
import { array } from 'yup';

export type userMovieQueryFields = 'name';

export const userMovieListQueryFields: userMovieQueryFields[] = ['name'];

export const updateUserMovieSchema = yup.object().shape({
  body: yup.object().shape({
    favorite: booleanNotRequired(),
    watchStatus: enumTypeNotRequired({ data: WatchStatus }),
    score: numberNotRequired()
  })
});

export const updateMultipleUserMovieSchema = yup.object().shape({
  body: yup.object().shape({
    movie: array().of(
      yup.object().shape({
        id: numberRequired().integer(),
        favorite: booleanNotRequired(),
        watchStatus: enumTypeNotRequired({ data: WatchStatus }),
        score: numberNotRequired()
      })
    )
  })
});
