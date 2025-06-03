export type Run = {
  index: number;
  currentDay: number;
  estimatedDay: number;
};

export type Performance = "On Target" | "Near Target" | "Underperforming";

export type FilterType<T> = (r: T, i: number, a: T[]) => boolean;

export type SortingType<T> = (a: T, b: T) => number;

export type ShadowColours = "green" | "yellow" | "red" | "gray";
