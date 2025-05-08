<script lang="ts">
  import { onMount } from "svelte";
  import RunOverview from "../components/RunOverview.svelte";
  import Search from "../components/Search.svelte";
  import SortAndFilter from "../components/SortAndFilter.svelte";
  import type { Run as RunType } from "../core/types";
  import Run from "../components/Run.svelte";
  import { maxDays } from "../core/consts";

  const runs: RunType[] = $state([]);

  onMount(() => {
    for (let i = 0; i < maxDays; i++) {
      const randomDevians = Math.round(Math.random() * (maxDays / 2 - i));
      runs.push({
        index: i + 1,
        currentDay: maxDays - i,
        estimatedDay:
          Math.random() < 0.7 ? maxDays - i : maxDays - i - randomDevians,
      });
    }

    console.log(runs);
  });
</script>

<section>
  <h1>Active Runs</h1>
  <div class="controls">
    <SortAndFilter />
    <Search>
      <span class="run">Run: </span>
    </Search>
  </div>
  <RunOverview {runs} />
  <section class="runs">
    {#each runs as run}
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
