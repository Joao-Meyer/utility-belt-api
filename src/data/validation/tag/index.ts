import { yup } from '@infra/yup';
import { numberNotRequired, stringRequired } from '@main/utils';

export type tagQueryFields = 'name';

export const tagListQueryFields: tagQueryFields[] = ['name'];

export const insertTagSchema = yup.object().shape({
  body: yup.object().shape({
    name: stringRequired(255),
    movieId: numberNotRequired().integer(),
    seriesId: numberNotRequired().integer()
  })
});

export const updateTagSchema = yup.object().shape({
  body: yup.object().shape({
    name: stringRequired(255)
  })
});
