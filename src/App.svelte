<script lang="ts">
  import { onMount } from "svelte";
  import { path, routes } from "./stores/router";
  import NavButton from "./components/NavButton.svelte";

  let page = $derived({
    component: routes[$path],
  });
</script>

<main>
  {#if $path !== ""}
    <header>
      <NavButton route="" icon="home" />
    </header>
  {/if}
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

  header {
    position: absolute;
  }
</style>
