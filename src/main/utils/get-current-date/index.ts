export const getCurrentDate = (): string => {
  const today = new Date();
  today.setHours(-3);

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export const getDate = (date: string | Date): string => {
  const dateString = String(date).split('-');

  if (
    typeof date === 'string' &&
    dateString.length === 3 &&
    dateString[0].length === 4 &&
    dateString[1].length === 2 &&
    dateString[2].length === 2
  )
    return date;

  const today = new Date(date);
  today.setHours(-3);

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};
