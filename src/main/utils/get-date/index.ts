export const getFullDate = (date?: string | Date | null, slice?: boolean, end?: boolean): Date => {
  const formatDate = date ? new Date(date) : new Date();

  if (formatDate.getHours() < 3) formatDate.setHours(3, 1);

  const format = formatDate.toISOString();

  const value = new Date(String(format)?.trim().slice(0, 10));

  if (slice) {
    const todayISO = value.toISOString().slice(0, 10);

    const hours = end ? '23:59:59.999' : '00:00:00.000';

    return `${todayISO} ${hours} -0300` as unknown as Date;
  }

  return value;
};

export const addMinutesToDate = (minutes: number, baseDate: Date = new Date()): Date => {
  const result = new Date(baseDate);

  result.setMinutes(result.getMinutes() + minutes);

  return result;
};

export const addMonthToDate = (monthsToAdd: number, baseDate: Date = new Date()): Date => {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();
  const day = baseDate.getDate();

  const newMonth = month + monthsToAdd;
  const newDate = new Date(year, newMonth, 1);

  const lastDayOfTargetMonth = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0).getDate();

  newDate.setDate(Math.min(day, lastDayOfTargetMonth));

  return newDate;
};
