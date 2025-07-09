import { arrayIsEqual } from '@main/utils';

export const getDifferentObject = <T extends object>(
  oldItem: T,
  newItem: object
): { newData: Partial<T>; oldData: Partial<T> } => {
  const newData: Partial<T> = {};
  const oldData: Partial<T> = {};

  const newObject = newItem as T;

  for (const key of Object.keys(newObject) as (keyof T)[]) {
    const newValue = newObject[key];
    const oldValue = oldItem[key];

    if (newValue)
      if (
        (Array.isArray(newValue) && Array.isArray(oldValue) && !arrayIsEqual(newValue, oldValue)) ||
        newValue !== oldValue
      ) {
        newData[key] = newValue;
        oldData[key] = oldValue;
      }
  }

  return { oldData, newData };
};
