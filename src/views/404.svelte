<script>
  import { parameters } from "../stores/router";

  let invalidRoute = $derived(
    `${window.location.href.replace(
      window.location.search,
      ""
    )}/?route=${$parameters["invalidRoute"]}`
  );
</script>

<section>
  <h1>404</h1>

  {#if $parameters["invalidRoute"]}
    <div>
      invalid route: <a href={invalidRoute}>{invalidRoute}</a>
    </div>
  {/if}
</section>

<style>
  section {
    display: flex;
    flex-direction: column;
  }
</style>
