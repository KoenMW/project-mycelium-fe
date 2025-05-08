export type Run = {
  index: number;
  currentDay: number;
  estimatedDay: number;
};

export type Performance = "On Target" | "Near Target" | "Underperforming";

export type filterType<T> = (r: T, i: number, a: T[]) => boolean;

export type sortingType<T> = (a: T, b: T) => number;
