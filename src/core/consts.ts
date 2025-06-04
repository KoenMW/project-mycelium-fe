import type { Performance } from "./types";

export const maxDays = 20;
export const performanceToColour: Record<Performance, string> = {
  "On Target": "green",
  "Near Target": "yellow",
  Underperforming: "red",
};
