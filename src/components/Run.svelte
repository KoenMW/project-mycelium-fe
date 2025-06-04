<script lang="ts">
  import { maxDays, performanceToColour } from "../core/consts";
  import type { Performance, MyceliumInstance, Run } from "../core/types";
  import { calcPerformance } from "../core/utils";
  import { goTo } from "../stores/router";

  type props = {
    run: Run;
  };

  const { run }: props = $props();

  let performance: Performance = $derived(calcPerformance(run.instances[0]));

  const onclick = () => {
    goTo("detail", [
      {
        key: "index",
        value: `${run.index}`,
      },
    ]);
  };
</script>

<button class="container {performanceToColour[performance]}" {onclick}>
  <h3>{performance}</h3>
  <div class="detail-container">
    <div class="detail">
      <span>Sample</span>
      <span class="large">{run.index}</span>
    </div>
    <div class="detail">
      <span>Phase</span>
      <span class="large"
        >{Math.round((run.instances[0].estimatedDay / maxDays) * 5)}/5</span
      >
    </div>
    <div class="detail">
      <span>Current Day</span>
      <span class="large">{run.instances[0].currentDay}</span>
    </div>
    <div class="detail">
      <span>Estimated Day</span>
      <span class="large">{run.instances[0].estimatedDay}</span>
    </div>
  </div>
</button>

<style>
  .container {
    --padding: var(--p-tiny) var(--p-medium) var(--p-medium);
    position: relative;
    padding: var(--padding);
    border-radius: var(--p-medium);
    font-family: var(--font-stack);
    transition: all 0.1s ease-in-out;
  }

  .container::before {
    content: "";
    border-radius: var(--p-medium);
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    box-shadow: var(--shadow);
    transition: all 0.2s ease-in-out;
  }

  .container:hover {
    scale: 0.95;
  }

  .container:hover::before {
    opacity: 0;
  }

  .container:active {
    scale: 0.9;
  }

  h3 {
    margin: 0;
  }

  .green h3 {
    color: var(--c-green-accent);
  }

  .yellow h3 {
    color: var(--c-yellow-accent);
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
