import { yup } from '@infra/yup';
import { numberNotRequired, stringRequired } from '@main/utils';

export type categoryQueryFields = 'name';

export const categoryListQueryFields: categoryQueryFields[] = ['name'];

export const insertCategorySchema = yup.object().shape({
  body: yup.object().shape({
    name: stringRequired(255),
    movieId: numberNotRequired().integer(),
    seriesId: numberNotRequired().integer()
  })
});

export const updateCategorySchema = yup.object().shape({
  body: yup.object().shape({
    name: stringRequired(255)
  })
});
