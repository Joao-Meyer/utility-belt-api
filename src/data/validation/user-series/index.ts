import { WatchStatus } from '@domain/enum';
import { yup } from '@infra/yup';
import { booleanNotRequired, enumTypeNotRequired, numberNotRequired } from '@main/utils';

export type userSeriesQueryFields = 'name';

export const userSeriesListQueryFields: userSeriesQueryFields[] = ['name'];

export const updateUserSeriesSchema = yup.object().shape({
  body: yup.object().shape({
    favorite: booleanNotRequired(),
    watchStatus: enumTypeNotRequired({ data: WatchStatus }),
    score: numberNotRequired()
  })
});
