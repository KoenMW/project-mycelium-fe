<script lang="ts">
  import { onMount } from "svelte";
  import type { MyceliumInstance, Run } from "../core/types";
  import { runs } from "../stores/runs";
  import { drawTimeline } from "../core/d3";
  import * as d3 from "d3";

  const runIndex =
    Number(new URLSearchParams(window.location.search).get("index")) ?? -1;

  const run: Run | undefined = $runs[runIndex];

  let timeline: HTMLElement | null = $state(null);
  let width = $state(0);

  const timelineInit = async (width: number) => {
    if (timeline) timeline.innerHTML = "";
    await drawTimeline(run.instances[0], width);
  };

  $effect(() => {
    timelineInit(width);
  });

  const margin = 40;
  const confusionMatrixInit = (width: number) => {
    width = width * 0.5;
    const svg = d3
      .select(".matrix")
      .append("svg")
      .attr("width", width)
      .attr("height", width);

    const maxXRange = Math.max(run.instances[0].currentDay, 14);
    const maxYRange = Math.max(run.instances[0].estimatedDay, 14);

    const xScale = d3
      .scaleLinear()
      .domain([0, maxXRange + 1])
      .range([margin, width - margin]);
    const yScale = d3
      .scaleLinear()
      .domain([0, maxYRange + 1])
      .range([margin, width - margin]);

    svg
      .append("g")
      .attr("class", "xAxis")
      .call(d3.axisTop(xScale))
      .attr("transform", `translate(0, ${margin})`);
    svg
      .append("g")
      .attr("class", "xAxis")
      .call(d3.axisLeft(yScale))
      .attr("transform", `translate(${margin}, 0)`);
  };

  onMount(() => {
    timelineInit(width);
    confusionMatrixInit(width);
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
  <div class="matrix" style="height: {width}; width: {width};"></div>
  <!-- confusion matrix instead of cluster -->
</section>
