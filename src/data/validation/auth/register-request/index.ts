import { yup } from '@infra/yup';
import {
  booleanRequired,
  emailRequired,
  numberRequired,
  stringNotRequired,
  stringRequired
} from '@main/utils';

export const insertRegisterRequestSchema = yup.object().shape({
  body: yup.object().shape({
    email: emailRequired(),
    name: stringRequired(255),
    phone: stringRequired(25),
    companyName: stringRequired(255),
    description: stringNotRequired(),
    currencyId: numberRequired().integer(),
    planId: numberRequired().integer(),
    numberOfRestaurant: numberRequired().integer(),
    numberOfProduct: numberRequired().integer()
  })
});

export const updateRegisterRequestSchema = yup.object().shape({
  body: yup.object().shape({
    canRegister: booleanRequired()
  })
});

export type registerRequestQueryFields = 'email' | 'name' | 'phone' | 'companyName' | 'currencyId';

export const registerRequestListQueryFields: registerRequestQueryFields[] = [
  'name',
  'email',
  'phone',
  'companyName',
  'currencyId'
];
