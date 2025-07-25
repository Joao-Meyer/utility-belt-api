export const getQueryArray = (value: unknown): string[] =>
  Array.isArray(value) && value?.length && typeof value?.[0] === 'string'
    ? value?.[0]?.split(',')
    : [];
