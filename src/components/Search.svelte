<script lang="ts">
  import type { Snippet } from "svelte";

  type requiredProps = {
    children: Snippet;
    onInput: (v: string) => void;
  };

  type partialProps = Partial<{
    validChars: string;
  }>;

  let {
    children,
    onInput,
    validChars = "",
  }: requiredProps & partialProps = $props();

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

<div class="shadow">
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
