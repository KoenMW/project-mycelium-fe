<script lang="ts">
  import * as d3 from "d3";

  type props = {
    onTarget: number;
    nearTarget: number;
    underperformed: number;
  };

  const { onTarget, nearTarget, underperformed }: props = $props();

  const pie = d3.pie();
  const arcs = pie([onTarget, nearTarget, underperformed]);

  const svg = d3.select("#donut");

  svg.append("title").text("test");
  console.log("donut:", svg);
</script>

<h1>donut chart 🍩</h1>
