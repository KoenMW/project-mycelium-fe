<script lang="ts">
  import PB from "../core/pb";
  import { runs, updateAvailable } from "../stores/runs";

  const onclick = async () => {
    const pb = PB.getInstance();

    runs.set(await pb.getAll());

    updateAvailable.set(false);
  };
</script>

{#if $updateAvailable}
  <button {onclick}> refresh </button>
{/if}

<style>
  button {
    background-color: var(--c-green);
  }
</style>
