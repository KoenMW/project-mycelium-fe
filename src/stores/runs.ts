import { writable } from "svelte/store";
import type { FilterType, Run, SortingType } from "../core/types";
import PB from "../core/pb";

export const runs = writable<Run[]>([]);

export const updateAvailable = writable<boolean>(false);

export const filters = writable<Record<string, FilterType<Run>>>({});
export const sortings = writable<Record<string, SortingType<Run>>>({});

PB.getInstance();
