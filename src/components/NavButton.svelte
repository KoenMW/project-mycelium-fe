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
  class:icon
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
    background-color: var(--c-black-accent);
    position: relative;
    color: var(--c-white);
  }

  .nav-button::before {
    color: var(--c-black-accent);
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

  .icon {
    aspect-ratio: 1/1;
    border-radius: 100%;
  }

  .warning {
    background-color: var(--c-red);
    color: var(--c-red-accent);
  }
</style>
