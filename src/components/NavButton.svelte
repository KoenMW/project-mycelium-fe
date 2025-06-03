<script lang="ts">
  import type { Snippet } from "svelte";
  import { goTo } from "../stores/router";

  type Props = {
    route: string;
  };

  type PartialProps = Partial<{
    icon: string;
    children: Snippet;
  }>;

  const { children, route, icon }: Props & PartialProps = $props();
</script>

<button
  class="nav-button {!icon && !children && 'warning'}"
  onclick={() => goTo(route)}
>
  {#if icon}
    <img src="/project-mycelium-fe/icons/{icon}.svg" alt={icon} />
  {:else if children}
    {@render children()}
  {:else}
    <div class="warning">
      no <span class="bold">icon</span> or <span class="bold">children</span> provided
    </div>
  {/if}
</button>

<style>
  .nav-button {
    border-radius: 100%;
    aspect-ratio: 1 /1;
    transition: scale 0.1s ease-in-out;
    background-color: var(--c-black-accent);
    position: relative;
  }

  .nav-button::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    border-radius: inherit;
    box-shadow: var(--shadow);
  }

  .nav-button:hover {
    scale: 0.95;
  }

  .nav-button:hover::before {
    opacity: 0;
  }

  .nav-button:active {
    scale: 0.9;
  }

  .warning {
    background-color: var(--c-red);
    color: var(--c-red-accent);
  }
</style>
