<script>
  import Search from "../components/Search.svelte";
  import SortAndFilter from "../components/SortAndFilter.svelte";
  import { goTo } from "../stores/router";
</script>

<section>
  <h1>Active Runs</h1>
  <div class="controls">
    <SortAndFilter />
    <Search>
      <span class="run">Run: </span>
    </Search>
  </div>
</section>

<style>
  section {
    display: flex;
    flex-direction: column;
    align-items: start;
  }

  .controls {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    width: 100%;
  }

  .run {
    display: flex;
    align-items: center;
  }

  .run::before {
    content: "";
    display: block;
    width: 1.1rem;
    aspect-ratio: 1/ 1;
    background-image: url("/icons/search.svg");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }
</style>
