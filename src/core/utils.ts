import type { filterType, sortingType } from "./types";

export const applyMiltipleFiltersAndSortings = <T>(
  array: T[],
  filters: filterType<T>[],
  sortings: sortingType<T>[]
): T[] => {
  let result: T[] = array;

  filters.forEach((filter) => {
    result = result.filter(filter);
  });

  sortings.forEach((sorting) => {
    result = result.sort(sorting);
  });

  return result;
};
