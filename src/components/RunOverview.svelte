<script lang="ts">
  import type { Run } from "../core/types";
  import RunDonutChart from "./RunDonutChart.svelte";

  type props = {
    runs: Run[];
  };

  const { runs }: props = $props();

  let onTarget = $derived(
    runs.filter((r) => {
      return Math.abs(r.currentDay - r.estimatedDay) === 0;
    }).length
  );
  let nearTarget = $derived(
    runs.filter((r) => {
      return Math.abs(r.currentDay - r.estimatedDay) === 1;
    }).length
  );
  let underperformed = $derived(
    runs.filter((r) => {
      return Math.abs(r.currentDay - r.estimatedDay) > 1;
    }).length
  );
</script>

<section class="shadow">
  <div>
    <div class="detail">
      <span> Amount of runs: </span>
      <span class="large">
        {runs.length}
      </span>
    </div>
    <div class="detail-container">
      <div class="detail">
        <span> On Target: </span>
        <span class="medium">
          {onTarget}
        </span>
      </div>
      <div class="detail">
        <span> Near Target: </span>
        <span class="medium">
          {nearTarget}
        </span>
      </div>
      <div class="detail">
        <span> Underperforming: </span>
        <span class="medium">
          {underperformed}
        </span>
      </div>
    </div>
  </div>
  <div class="donut">
    <RunDonutChart {nearTarget} {onTarget} {underperformed} />
  </div>
</section>

<style>
  section {
    display: flex;

    width: calc(100% - (var(--p-medium) * 2));
    background-color: var(--c-white);
    padding: var(--p-medium);
    border-radius: var(--p-medium);
    flex-grow: 1;
    align-items: center;
  }

  .detail-container {
    display: flex;
    width: 100%;
    gap: var(--p-medium);
  }

  .detail {
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: space-between;
  }

  .medium {
    font-size: var(--fs-body-large);
  }

  .large {
    font-size: var(--fs-subheading);
  }

  .donut {
    flex-grow: 1;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
