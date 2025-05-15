<script lang="ts">
  import * as d3 from "d3";
  import { on } from "svelte/events";
  import { drawDonut } from "../core/d3";
  import type { derived } from "svelte/store";
  import { onMount } from "svelte";

  type props = {
    onTarget: number;
    nearTarget: number;
    underperformed: number;
  };

  const { onTarget, nearTarget, underperformed }: props = $props();

  let donut: HTMLDivElement;

  onMount(() => {
    const { svg, change } = drawDonut([
      { apples: onTarget, oranges: 200 },
      { apples: nearTarget, oranges: 200 },
      { apples: underperformed, oranges: 200 },
    ]);

    const chart = svg.node();
    if (chart) donut.appendChild(chart);

    let test = true;

    setInterval(() => {
      change(test ? "apples" : "oranges");
      test = !test;
    }, 2000);
  });
</script>

<h1>
  donut chart 🍩
  <div class="donut-container" bind:this={donut}></div>
</h1>
