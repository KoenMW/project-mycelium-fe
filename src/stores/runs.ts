import { writable } from "svelte/store";
import type { FilterType, Run, SortingType } from "../core/types";
import { maxDays } from "../core/consts";

export const runs = writable<Run[]>([]);

export const filters = writable<Record<string, FilterType<Run>>>({});
export const sortings = writable<Record<string, SortingType<Run>>>({});

const runsInit = () => {
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
  runs.set(r);
};

runsInit();
