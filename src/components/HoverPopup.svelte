<script lang="ts">
  import { onMount, type Snippet } from "svelte";

  type Props = {
    children: Snippet;
  };
  const { children }: Props = $props();

  let anchor: HTMLElement;
  let visible: boolean = $state(false);

  onMount(() => {
    const parent = anchor.parentElement;
    if (!parent) {
      console.error("no parent element for popup");
      return;
    }

    parent.addEventListener("mouseover", () => {
      visible = true;
    });

    parent.addEventListener("mouseleave", () => {
      visible = false;
    });
  });
</script>

<div class="anchor" bind:this={anchor}>
  <section style="display: {visible ? 'block' : 'none'};">
    {@render children()}
  </section>
</div>

<style>
  .anchor {
    position: relative;
    align-self: flex-start;
  }
  section {
    position: absolute;
    left: 0;
    top: 0;
    width: fit-content;
  }
</style>
