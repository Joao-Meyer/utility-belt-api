import { yup } from '@infra/yup';
import type {
  AnyObject,
  AnySchema,
  BooleanSchema,
  DateSchema,
  Maybe,
  MixedSchema,
  NumberSchema,
  StringSchema
} from 'yup';

export const emailRequired = (): StringSchema => yup.string().email().required().max(255);

export const emailNotRequired = (): StringSchema => yup.string().email().max(255);

export const stringRequired = (length?: number): StringSchema =>
  typeof length === 'number'
    ? yup.string().trim().max(length).required()
    : yup.string().trim().required();

export const stringNotRequired = (length?: number): StringSchema<Maybe<string | undefined>> =>
  typeof length === 'number'
    ? yup.string().trim().max(length).notRequired()
    : yup.string().trim().notRequired();

export const mixedRequired = (): MixedSchema => yup.mixed().required();

export const mixedNotRequired = (): MixedSchema<Maybe<AnyObject>> =>
  yup.mixed().required().notRequired();

export const booleanRequired = (): BooleanSchema => yup.boolean().required();

export const booleanNotRequired = (): BooleanSchema<Maybe<boolean | undefined>> =>
  yup.boolean().notRequired();

export const numberRequired = (): NumberSchema => yup.number().required();

export const numberNotRequired = (): NumberSchema<Maybe<number | undefined>> =>
  yup.number().notRequired();

export const dateRequired = (): DateSchema => yup.date().required();

export const dateNotRequired = (): DateSchema<Maybe<Date | undefined>> => yup.date().notRequired();

export const arrayRequired = (data: AnySchema): AnySchema => yup.array().of(data).required();

export const arrayNotRequired = (data: AnySchema): AnySchema => yup.array().of(data);

export const enumTypeRequired = <Enum extends object>({ data }: { data: Enum }): AnySchema =>
  yup.mixed<Enum>().oneOf(Object.values(data)).required();

export const enumTypeNotRequired = <Enum extends object>({ data }: { data: Enum }): AnySchema =>
  yup.mixed<Enum>().oneOf(Object.values(data));
