import { Between, ILike, In, IsNull, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { toNumber } from '../to-number';

interface GetPageAndLimitInput<QueryType extends string> {
  query: {
    [key in QueryType]?: string;
  } & {
    orderBy?: QueryType;
    sort?: 'asc' | 'desc';
    startDate?: string;
    endDate?: string;
    history?: string;
  };
  list: QueryType[];
}

type OrderItem = { value: string; sort: 'ASC' | 'DESC' };

interface GetPageAndLimitOutput {
  orderItem?: OrderItem;
  orderBy: object;
  where: object;
}

const isObjectEmpty = (obj: object): boolean => Object.keys(obj).length === 0;

const getDate = (item: string, isEnd?: boolean): Date | string | null => {
  const date = new Date(item?.trim().slice(0, 10));

  if (isNaN(date.getTime())) return null;

  if (isEnd ?? false) return date.toISOString().replace('T00:00:00.000Z', 'T23:59:59.999Z');

  return date.toISOString();
};

interface queryProps {
  orderBy: string;
  sort?: 'asc' | 'desc';
}

const checkOrder = (query: queryProps, list: string[]): boolean =>
  typeof query.sort === 'string' &&
  (query.sort?.toLowerCase() === 'asc' || query.sort?.toLowerCase() === 'desc') &&
  (list.some((item) => item?.startsWith(query.orderBy)) ||
    query.orderBy === 'createdAt' ||
    query.orderBy === 'updatedAt') &&
  (!query.orderBy.endsWith('MoreThan') ||
    !query.orderBy.endsWith('LessThan') ||
    !query.orderBy.endsWith('Id') ||
    !query.orderBy.endsWith('Enum') ||
    !query.orderBy.endsWith('Boolean'));

export const getGenericFilter = <QueryType extends string>({
  query,
  list
}: GetPageAndLimitInput<QueryType>): GetPageAndLimitOutput => {
  const orderBy = {};
  const orderItem = {} as OrderItem;
  const where: object = {};

  // if (String(query.history) !== 'true')
  Object.assign(where, { finishedAt: IsNull() });

  let startDate = null;
  let endDate = null;

  if (typeof query.startDate === 'string') startDate = getDate(query.startDate);

  if (typeof query.endDate === 'string') endDate = getDate(query.endDate, true);

  if (endDate !== null && startDate !== null)
    Object.assign(where, { createdAt: Between(startDate, endDate) });
  else if (endDate !== null) Object.assign(where, { createdAt: LessThanOrEqual(endDate) });
  else if (startDate !== null) Object.assign(where, { createdAt: MoreThanOrEqual(startDate) });

  if (typeof query.orderBy === 'string' && checkOrder(query as queryProps, list)) {
    Object.assign(orderBy, { [query.orderBy]: query.sort });
    Object.assign(orderItem, { value: query.orderBy, sort: query.sort?.toUpperCase() });
  }

  for (const item of list) {
    const value = query[item];

    if (typeof value === 'string') {
      if (item.endsWith('MoreThan'))
        Object.assign(where, {
          [item.replace('MoreThan', '')]: MoreThanOrEqual(Number(value))
        });
      else if (item.endsWith('LessThan'))
        Object.assign(where, {
          [item.replace('LessThan', '')]: LessThanOrEqual(Number(value))
        });
      else if (item.endsWith('Boolean'))
        Object.assign(where, {
          [item.replace('Boolean', '')]: Boolean(value)
        });
      else if (item.endsWith('Id')) {
        if (toNumber(value) > 0) Object.assign(where, { [item]: toNumber(value) });
      } else if (item.endsWith('Enum')) Object.assign(where, { [item.replace('Enum', '')]: value });
      else if (item === 'zipCode' || item === 'phone')
        Object.assign(where, { [item]: ILike(`%${value?.replace(/\D/gu, '') ?? ''}%`) });
      else Object.assign(where, { [item]: ILike(`%${value ?? ''}%`) });
    } else if (typeof value === 'object' && String(value)?.length > 0) {
      const list = String(value).split(',') as unknown[];

      if (item.endsWith('Id'))
        Object.assign(where, { [item]: In(list.map((listItem) => toNumber(listItem))) });
    }
  }
  if (isObjectEmpty(orderBy)) Object.assign(orderBy, { createdAt: 'desc' });

  return { orderBy, where, orderItem };
};
