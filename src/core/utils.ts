import type { filterType, Performance, Run, sortingType } from "./types";

export const applyMiltipleFiltersAndSortings = <T>(
  array: T[],
  filters: Record<string, filterType<T>>,
  sortings: Record<string, sortingType<T>>
): T[] => {
  let result: T[] = array;

  for (const filterKey in filters) {
    result = result.filter(filters[filterKey]);
  }

  for (const sortKey in sortings) {
    result = result.sort(sortings[sortKey]);
  }

  return result;
};

export const calcPerformance = (run: Run): Performance => {
  return run.currentDay === run.estimatedDay
    ? "On Target"
    : Math.abs(run.currentDay - run.estimatedDay) === 1
    ? "Near Target"
    : "Underperforming";
};

export const calcPerformanceNumber = (run: Run): 0 | 1 | 2 => {
  return run.currentDay === run.estimatedDay
    ? 0
    : Math.abs(run.currentDay - run.estimatedDay) === 1
    ? 1
    : 2;
};

const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export const generateId = (length: number = 10) => {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};
