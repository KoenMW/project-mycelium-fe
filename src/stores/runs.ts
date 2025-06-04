import { writable } from "svelte/store";
import type { FilterType, Run, SortingType } from "../core/types";

export const runs = writable<Run[]>([]);

export const filters = writable<Record<string, FilterType<Run>>>({});
export const sortings = writable<Record<string, SortingType<Run>>>({});

const runInit = (maxDays: number) => {
  const r = [];
  for (let i = 0; i < maxDays; i++) {
    const randomDevians = Math.round(Math.random() * (maxDays / 2 - i));
    r.push({
      index: i + 1,
      currentDay: maxDays - i,
      estimatedDay:
        Math.random() < 0.7 ? maxDays - i : maxDays - i - randomDevians,
    });
  }
  return r;
};

const dummyRuns = () => {
  const dummy: Run[] = [];
  for (let i = 0; i < 20; i++) {
    dummy.push({
      index: i,
      instances: runInit(20 - i),
    });
  }

  runs.set(dummy.reverse());
};

dummyRuns();
