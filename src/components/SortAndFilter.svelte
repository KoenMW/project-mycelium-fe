<script lang="ts">
  import type { Performance } from "../core/types";
  import { calcPerformance } from "../core/utils";
  import { filters } from "../stores/runs";
  import HoverPopup from "./HoverPopup.svelte";

  let selected = $state<Performance | "">("");

  const select = (performance: Performance) => {
    if (selected === performance) {
      filters.update((f) => {
        f["performance"] = () => true;
        return f;
      });
      selected = "";
      return;
    }
    filters.update((f) => {
      f["performance"] = (r) => calcPerformance(r) === performance;
      return f;
    });
    selected = performance;
  };

  $effect(() => {
    if (!$filters["performance"]) selected = "";
  });
</script>

<div>
  <span
    >Sort
    <HoverPopup>some sort options</HoverPopup>
  </span>
  <span
    >Filter
    <HoverPopup
      ><div class="filters">
        <div class="performance">
          performance: <button
            class="red {selected === 'Underperforming' && 'selected'}"
            onclick={() => select("Underperforming")}>Underperforming</button
          ><button
            class="yellow {selected === 'Near Target' && 'selected'}"
            onclick={() => select("Near Target")}>Near Target</button
          ><button
            class="green {selected === 'On Target' && 'selected'}"
            onclick={() => select("On Target")}>On Target</button
          >
        </div>
      </div></HoverPopup
    ></span
  >
</div>

<style>
  div {
    background-color: var(--c-white);
    padding: var(--p-medium);
    display: flex;
    flex-direction: column;
    min-width: 10rem;
    align-items: start;
    border-radius: var(--p-medium);
    font-weight: bold;
  }

  span {
    display: flex;
    align-items: center;
    gap: 1ch;
    position: relative;
  }

  span::before {
    content: "";
    display: block;
    width: 0.5rem;
    aspect-ratio: 1 / 1;
    border-radius: 100%;
    background-color: var(--c-gray);
  }

  .performance {
    display: flex;
    flex-direction: row;
    width: 100%;
    align-items: center;
    gap: 1rem;
  }

  .performance button {
    min-width: 10rem;
  }

  .selected {
    color: var(--c-white);
  }

  .red.selected {
    background-color: var(--c-red-accent);
  }

  .green.selected {
    background-color: var(--c-green-accent);
  }

  .yellow.selected {
    background-color: var(--c-yellow-accent);
  }
</style>
