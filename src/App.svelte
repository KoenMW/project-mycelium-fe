<script lang="ts">
  import { onMount } from "svelte";
  import { path, routes } from "./stores/router";

  let page = $derived({
    component: routes[$path],
  });
</script>

<main>
  <page.component />
</main>

<style>
  main {
    --p: 1.5rem;
    display: flex;
    flex-direction: column;
    padding: var(--p);
    width: calc(100dvw - (var(--p) * 2));
    height: calc(100dvh - (var(--p) * 2));
    overflow: auto;
  }
</style>
