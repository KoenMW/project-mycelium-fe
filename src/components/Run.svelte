<script lang="ts">
  import { maxDays } from "../core/consts";
  import type { Performance, Run } from "../core/types";

  type props = {
    run: Run;
  };

  const { run }: props = $props();

  const performanceClasses: Record<Performance, string> = {
    "On Target": "green",
    "Near Target": "yellow",
    Underperforming: "red",
  };

  let performance: Performance = $derived(
    run.currentDay === run.estimatedDay
      ? "On Target"
      : Math.abs(run.currentDay - run.estimatedDay) === 1
        ? "Near Target"
        : "Underperforming"
  );
</script>

<div class="container {performanceClasses[performance]}">
  <h3>{performance}</h3>
  <div class="detail-container">
    <div class="detail">
      <span>Run</span>
      <span class="large">{run.index}</span>
    </div>
    <div class="detail">
      <span>Phase</span>
      <span class="large">{Math.round((run.estimatedDay / maxDays) * 5)}/5</span
      >
    </div>
    <div class="detail">
      <span>Current Day</span>
      <span class="large">{run.currentDay}</span>
    </div>
    <div class="detail">
      <span>Estimated Day</span>
      <span class="large">{run.estimatedDay}</span>
    </div>
  </div>
</div>

<style>
  .container {
    --padding: var(--p-tiny) var(--p-medium) var(--p-medium);

    padding: var(--padding);
    border-radius: var(--p-medium);
  }

  h3 {
    margin: 0;
  }

  .green {
    background-color: var(--c-green);
  }

  .green h3 {
    color: var(--c-green-accent);
  }

  .yellow {
    background-color: var(--c-yellow);
  }

  .yellow h3 {
    color: var(--c-yellow-accent);
  }

  .red {
    background-color: var(--c-red);
  }

  .red h3 {
    color: var(--c-red-accent);
  }

  .detail-container {
    --size: 7rem;
    width: calc((var(--size) * 2) + (var(--p-tiny) * 5));
    display: flex;
    flex-wrap: wrap;
    gap: var(--p-tiny);
  }

  .detail {
    background-color: var(--c-white);
    padding: var(--p-tiny);
    border-radius: var(--p-small);
    display: flex;
    flex-direction: column;
    align-items: center;
    height: var(--size);
    width: var(--size);
    color: var(--c-black-accent);
  }

  span {
    width: fit-content;
  }

  .large {
    font-size: var(--fs-subheading);
    color: var(--c-black);
  }
</style>
