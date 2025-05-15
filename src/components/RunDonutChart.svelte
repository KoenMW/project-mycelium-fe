<script lang="ts">
  import { drawDonut } from "../core/d3";
  import { onMount } from "svelte";

  type Props = {
    onTarget: number;
    nearTarget: number;
    underperformed: number;
  };

  let { onTarget, nearTarget, underperformed }: Props = $props();

  let donut: HTMLDivElement;

  let update: ((value: number[]) => void) | null = $state(null);

  $effect(() => {
    if (update) update([onTarget, nearTarget, underperformed]);
  });

  onMount(() => {
    const { svg, change } = drawDonut([onTarget, nearTarget, underperformed]);

    update = change;

    const chart = svg.node();
    if (chart) donut.appendChild(chart);
  });
</script>

<h1>
  donut chart
  <div class="donut-container" bind:this={donut}></div>
</h1>
