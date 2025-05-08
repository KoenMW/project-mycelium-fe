<script lang="ts">
  import type { Snippet } from "svelte";

  type props = {
    children: Snippet;
    onInput: (v: string) => void;
  };
  let { children, onInput }: props = $props();

  let value: string = $state("");

  $effect(() => {
    onInput(value);
  });
</script>

<div>
  {@render children()}
  <input type="text" bind:value />
</div>

<style>
  div {
    background-color: var(--c-white);
    padding: var(--p-medium);
    border-radius: var(--p-medium);
    display: flex;
    height: min-content;
    align-items: center;
    gap: 0.5ch;
    font-weight: bold;
    align-self: flex-end;
  }

  input {
    --border: 0.1rem solid var(--c-black-accent);
    background-color: inherit;
    border-radius: 0.4rem;
    border: var(--border);
    width: 7rem;
  }

  input:focus {
    outline: none;
    border: var(--border);
  }
</style>
