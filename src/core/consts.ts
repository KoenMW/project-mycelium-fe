import type { Performance } from "./types";

export const maxDays = 14;

export const nPhases = 3;
export const performanceToColour: Record<Performance, string> = {
  "On Target": "green",
  "Near Target": "yellow",
  Underperforming: "red",
};
