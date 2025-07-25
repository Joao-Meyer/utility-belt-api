import { yup } from '@infra/yup';
import { numberNotRequired, stringRequired } from '@main/utils';

export type categoryQueryFields = 'name' | 'totalItems' | 'itemsRate';

export const categoryListQueryFields: categoryQueryFields[] = ['name', 'totalItems', 'itemsRate'];

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
