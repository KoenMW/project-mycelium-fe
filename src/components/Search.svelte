<script lang="ts">
  import type { Snippet } from "svelte";
  import type { ShadowColours } from "../core/types";

  type RequiredProps = {
    children: Snippet;
    onInput: (v: string) => void;
  };

  type PartialProps = Partial<{
    validChars: string;
    shadowColour: ShadowColours;
  }>;

  let {
    children,
    onInput,
    validChars = "",
    shadowColour = "gray",
  }: RequiredProps & PartialProps = $props();

  let value: string = $state("");

  $effect(() => {
    onInput(value);
  });

  const checkAllChars = (input: string): boolean => {
    for (let i = 0; i < input.length; i++) {
      if (!validChars.includes(input[i])) return false;
    }
    return true;
  };

  $effect(() => {
    if (!validChars || checkAllChars(value)) return;
    let filtered = "";
    for (let i = 0; i < value.length; i++) {
      if (validChars.includes(value[i])) filtered += value[i];
    }
    value = filtered;
  });
</script>

<div style="--c: var(--c-{shadowColour})">
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
    box-shadow: var(--shadow) var(--c);
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
