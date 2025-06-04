<script lang="ts">
  import { onMount } from "svelte";
  import type { MyceliumInstance, Run } from "../core/types";
  import { runs } from "../stores/runs";
  import { drawConfusionMatrix, drawTimeline } from "../core/d3";
  import * as d3 from "d3";
  import { performanceToColour } from "../core/consts";
  import { calcPerformance } from "../core/utils";

  const runIndex =
    Number(new URLSearchParams(window.location.search).get("index")) ?? -1;

  const run: Run | undefined = $runs.find((r) => r.index === runIndex);

  let timeline: HTMLElement | null = $state(null);
  let matrix: HTMLElement | null = $state(null);
  let width = $state(0);

  const d3Init = async (width: number) => {
    if (!run) {
      console.error(`coulnd't find run with index: ${runIndex}`);
      return;
    }
    if (timeline) timeline.innerHTML = "";
    if (matrix) matrix.innerHTML = "";
    await drawTimeline(run.instances[0], width);
    drawConfusionMatrix(run, width);
  };

  $effect(() => {
    d3Init(width);
  });

  onMount(() => {
    d3Init(width);
  });
</script>

<h1>Run {runIndex}</h1>

<section
  class="timeline"
  bind:clientWidth={width}
  bind:this={timeline}
></section>

<section>
  <h2>You myceliums confusion matrix</h2>
  <div
    class="matrix"
    bind:this={matrix}
    style="height: {width}; width: {width};"
  ></div>
</section>
