import type {
  FilterType,
  Performance,
  MyceliumInstance,
  SortingType,
  Run,
} from "./types";

export const applyMiltipleFiltersAndSortings = <T>(
  array: T[],
  filters: Record<string, FilterType<T>>,
  sortings: Record<string, SortingType<T>>
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

export const calcPerformance = (run: MyceliumInstance): Performance => {
  return run.actualDay === run.estimatedDay
    ? "On Target"
    : Math.abs(run.actualDay - run.estimatedDay) === 1
    ? "Near Target"
    : "Underperforming";
};

export const calcPerformanceNumber = (run: MyceliumInstance): 0 | 1 | 2 => {
  return run.actualDay === run.estimatedDay
    ? 0
    : Math.abs(run.actualDay - run.estimatedDay) === 1
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

export const findLatestDayIndex = (run: Run) => {
  let maxDay = -Infinity;
  let index = -1;

  for (let i = 0; i < run.instances.length; i++) {
    if (maxDay < run.instances[i].actualDay) {
      maxDay = run.instances[i].actualDay;
      index = i;
    }
  }

  return index;
};

export const getFirstPreview = (files: FileList | null): string => {
  if (!files) return "";
  const file = files.item(0);
  if (!file) return "";
  return URL.createObjectURL(file);
};
