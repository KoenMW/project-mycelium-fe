<script lang="ts">
  import { onMount } from "svelte";
  import type { Run } from "../core/types";
  import { runs } from "../stores/runs";
  import * as d3 from "d3";
  import { performanceToColour } from "../core/consts";
  import { calcPerformance } from "../core/utils";
  import { addLocation } from "../core/d3";

  const runIndex =
    Number(new URLSearchParams(window.location.search).get("index")) ?? -1;

  const run: Run | undefined = $runs[runIndex];

  let timeline: HTMLElement | null = $state(null);
  let width = $state(0);
  const tickSize = 6;
  const margin = { right: 30, left: 40 };
  const colour = performanceToColour[calcPerformance(run)];

  const d3timelineInit = async (width: number) => {
    if (timeline) timeline.innerHTML = "";
    const maxRange = Math.max(run.currentDay, run.estimatedDay, 14);
    const svg = d3.select(".timeline").append("svg").attr("width", width);
    const xScale = d3
      .scaleLinear()
      .domain([0, maxRange + 1])
      .range([margin.left, width - margin.right]);
    const group = svg
      .append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0, ${50})`)
      .call(d3.axisBottom(xScale));

    svg.select(".domain").remove();

    group
      .append("line")
      .attr("x1", xScale.range()[0])
      .attr("x2", xScale.range()[1])
      .attr("y1", tickSize / 2)
      .attr("y2", tickSize / 2)
      .attr("stroke", "var(--c-black-accent)");

    addLocation(group, xScale, run.currentDay, colour, "current day");

    if (run.currentDay != run.estimatedDay)
      addLocation(group, xScale, run.estimatedDay, colour, "estimated day");
  };

  $effect(() => {
    d3timelineInit(width);
  });

  onMount(() => d3timelineInit(width));
</script>

<h1>Run {runIndex}</h1>

<section
  class="timeline"
  bind:clientWidth={width}
  bind:this={timeline}
></section>
