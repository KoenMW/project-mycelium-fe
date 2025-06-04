export type MyceliumInstance = {
  index: number;
  currentDay: number;
  estimatedDay: number;
};

export type Run = {
  index: number;
  instances: MyceliumInstance[];
};

export type Performance = "On Target" | "Near Target" | "Underperforming";

export type FilterType<T> = (r: T, i: number, a: T[]) => boolean;

export type SortingType<T> = (a: T, b: T) => number;

export type ShadowColours = "green" | "yellow" | "red" | "gray";
