import type { filterType, sortingType } from "./types";

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
