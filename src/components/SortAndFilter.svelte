<script lang="ts">
  import type { Performance, ShadowColours } from "../core/types";
  import {
    calcPerformance,
    calcPerformanceNumber,
    findLatestDayIndex,
  } from "../core/utils";
  import { filters, sortings } from "../stores/runs";
  import HoverPopup from "./HoverPopup.svelte";

  type PartialProps = Partial<{
    shadowColour: ShadowColours;
  }>;

  const { shadowColour = "gray" }: PartialProps = $props();

  let selectedPerformanceFilter = $state<Performance | "">("");

  let selectedPerformanceSort = $state<"ascending" | "descending" | "">("");

  const selectPerformanceFilter = (performance: Performance) => {
    if (selectedPerformanceFilter === performance) {
      filters.update((f) => {
        f["performance"] = () => true;
        return f;
      });
      selectedPerformanceFilter = "";
      return;
    }
    filters.update((f) => {
      f["performance"] = (r) => {
        const latestIndex = findLatestDayIndex(r);
        return calcPerformance(r.instances[latestIndex]) === performance;
      };
      return f;
    });
    selectedPerformanceFilter = performance;
  };

  const selectPerformanceSort = (direction: "ascending" | "descending") => {
    if (selectedPerformanceSort === direction) {
      sortings.update((s) => {
        delete s["performance"];
        return s;
      });
      selectedPerformanceSort = "";
      return;
    }
    sortings.update((s) => {
      s["performance"] = (a, b) => {
        const latestAIndex = findLatestDayIndex(a);
        const latestBIndex = findLatestDayIndex(b);
        return direction === "ascending"
          ? calcPerformanceNumber(b.instances[latestBIndex]) -
              calcPerformanceNumber(a.instances[latestAIndex])
          : calcPerformanceNumber(a.instances[latestAIndex]) -
              calcPerformanceNumber(b.instances[latestBIndex]);
      };
      return s;
    });
    selectedPerformanceSort = direction;
  };

  $effect(() => {
    if (!$filters["performance"]) selectedPerformanceFilter = "";
  });
</script>

<div class="container" style="--c: var(--c-{shadowColour})">
  <span
    >Sort
    <HoverPopup>
      <div class="performance">
        performance: <button
          class="red {selectedPerformanceSort === 'ascending'
            ? 'selected'
            : ''}"
          onclick={() => selectPerformanceSort("ascending")}
        >
          ascending
        </button><button
          class="green {selectedPerformanceSort === 'descending'
            ? 'selected'
            : ''}"
          onclick={() => selectPerformanceSort("descending")}
        >
          descending
        </button>
      </div>
    </HoverPopup>
  </span>
  <span
    >Filter
    <HoverPopup
      ><div class="filters">
        <div class="performance">
          performance: <button
            class="red {selectedPerformanceFilter === 'Underperforming' &&
              'selected'}"
            onclick={() => selectPerformanceFilter("Underperforming")}
            >Underperforming</button
          ><button
            class="yellow {selectedPerformanceFilter === 'Near Target' &&
              'selected'}"
            onclick={() => selectPerformanceFilter("Near Target")}
            >Near Target</button
          ><button
            class="green {selectedPerformanceFilter === 'On Target' &&
              'selected'}"
            onclick={() => selectPerformanceFilter("On Target")}
            >On Target</button
          >
        </div>
      </div></HoverPopup
    ></span
  >
</div>

<style>
  .container {
    background-color: var(--c-white);
    padding: var(--p-medium);
    display: flex;
    flex-direction: column;
    min-width: 10rem;
    align-items: start;
    border-radius: var(--p-medium);
    font-weight: bold;
    box-shadow: var(--shadow) var(--c);
  }

  span {
    display: flex;
    align-items: center;
    gap: 1ch;
    position: relative;
  }

  span::before {
    content: "";
    display: block;
    width: 0.5rem;
    aspect-ratio: 1 / 1;
    border-radius: 100%;
    background-color: var(--c-gray);
  }

  .performance {
    display: flex;
    flex-direction: row;
    width: 100%;
    align-items: center;
    gap: 1rem;
  }

  .performance button {
    min-width: 10rem;
  }

  .selected {
    background-color: var(--c-black-accent);
    color: var(--c-white);
  }

  .red.selected {
    background-color: var(--c-red-accent);
  }

  .green.selected {
    background-color: var(--c-green-accent);
  }

  .yellow.selected {
    background-color: var(--c-yellow-accent);
  }
</style>
