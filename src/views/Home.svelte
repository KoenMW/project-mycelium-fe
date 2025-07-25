<script lang="ts">
  import RunOverview from "../components/RunOverview.svelte";
  import Search from "../components/Search.svelte";
  import SortAndFilter from "../components/SortAndFilter.svelte";
  import { filters, runs, sortings, updateAvailable } from "../stores/runs";
  import {
    applyMiltipleFiltersAndSortings,
    findLatestDayIndex,
  } from "../core/utils";
  import type {
    MyceliumInstance,
    Run as RunType,
    ShadowColours,
  } from "../core/types";
  import Run from "../components/Run.svelte";
  import RefreshButton from "../components/RefreshButton.svelte";
  import NavButton from "../components/NavButton.svelte";

  const displayRuns = $derived(
    applyMiltipleFiltersAndSortings<RunType>($runs, $filters, $sortings)
  );

  const onInput = (searchString: string) => {
    filters.set({
      searchString: (r) => {
        if (!searchString) return true;
        return r.index.toString() === searchString;
      },
    });
  };

  let onTarget = $derived(
    displayRuns.filter((r) => {
      const latestIndex = findLatestDayIndex(r);
      return (
        Math.abs(
          r.instances[latestIndex].actualDay -
            r.instances[latestIndex].estimatedDay
        ) === 0
      );
    }).length
  );
  let nearTarget = $derived(
    displayRuns.filter((r) => {
      const latestIndex = findLatestDayIndex(r);
      return (
        Math.abs(
          r.instances[latestIndex].actualDay -
            r.instances[latestIndex].estimatedDay
        ) === 1
      );
    }).length
  );
  let underperformed = $derived(
    displayRuns.filter((r) => {
      const latestIndex = findLatestDayIndex(r);
      return (
        Math.abs(
          r.instances[latestIndex].actualDay -
            r.instances[latestIndex].estimatedDay
        ) > 1
      );
    }).length
  );

  let shadowColour: ShadowColours = $derived(
    onTarget >= nearTarget && onTarget >= underperformed
      ? "green"
      : nearTarget >= underperformed
        ? "yellow"
        : "red"
  );
</script>

<section>
  <h1>Active Runs</h1>
  <RefreshButton />
  <div>
    <NavButton route="predict">predict</NavButton>
    <NavButton route="zip">upload data</NavButton>
  </div>
  <div class="controls">
    <SortAndFilter {shadowColour} />
    <Search {onInput} validChars="0123456789" {shadowColour}>
      <span class="run">Sample: </span>
    </Search>
  </div>
  <RunOverview {onTarget} {nearTarget} {underperformed} {shadowColour} />
  <section class="runs">
    {#each displayRuns as run}
      <Run {run} />
    {/each}
  </section>
</section>

<style>
  section {
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: var(--p-medium);
  }

  .controls {
    display: flex;
    flex-wrap: wrap;
    gap: var(--p-medium);
    width: 100%;
  }

  .run {
    display: flex;
    align-items: center;
  }

  .run::before {
    content: "";
    display: block;
    width: 1.1rem;
    aspect-ratio: 1/ 1;
    background-image: url("/icons/search.svg");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }

  .runs {
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
</style>
