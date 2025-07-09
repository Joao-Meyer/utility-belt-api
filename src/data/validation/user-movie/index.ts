import { WatchStatus } from '@domain/enum';
import { yup } from '@infra/yup';
import { booleanNotRequired, enumTypeNotRequired, numberNotRequired } from '@main/utils';

export type userMovieQueryFields = 'name';

export const userMovieListQueryFields: userMovieQueryFields[] = ['name'];

export const updateUserMovieSchema = yup.object().shape({
  body: yup.object().shape({
    favorite: booleanNotRequired(),
    watchStatus: enumTypeNotRequired({ data: WatchStatus }),
    score: numberNotRequired()
  })
});
