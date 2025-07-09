export const findParamsToSelect = (list: [object, string][]): string[] => {
  const finalList: string[] = [];
  list.forEach(([object, name]) => {
    Object.keys(object).forEach((item) => finalList.push(`${name}.${item}`));
  });

  return finalList;
};
