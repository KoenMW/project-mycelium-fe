export type PBMycelium = {
  id: string;
  segmented: string;
  run: number;
  hour: number;
  angle: number;
  estimatedDay: number;
};

export type MyceliumInstance = {
  id: string;
  segmented: string;
  run: number;
  actualDay: number;
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
