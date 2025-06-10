import * as d3 from "d3";
import { calcPerformance, generateId } from "./utils";
import type { MyceliumInstance, Run } from "./types";
import { performanceToColour } from "./consts";

const getColor = (index: number) => {
  if (index === 0) return "var(--c-green)";
  if (index === 1) return "var(--c-yellow)";
  return "var(--c-red)";
};

const currentRecord: Record<
  string,
  d3.PieArcDatum<number | { valueOf(): number }>
> = {};

const setCurrent: d3.ValueFn<
  d3.BaseType | SVGPathElement,
  d3.PieArcDatum<number | { valueOf(): number }>,
  void
> = (data, index, groups) => {
  const arc = groups[index];

  if (!arc || !(arc instanceof SVGPathElement)) {
    console.log("arc not found");
    return;
  }

  const id = generateId();

  arc.id = id;

  currentRecord[id] = data;
};

export const drawDonut = (data: number[]) => {
  const height = 500;
  const width = height;
  const outerRadius = height / 2 - 10;
  const innerRadius = outerRadius * 0.75;

  const svg = d3
    .create("svg")
    .attr("viewBox", [-width / 2, -height / 2, width, height]);

  const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);

  const tween: d3.ValueFn<
    d3.BaseType | SVGPathElement,
    d3.PieArcDatum<number | { valueOf(): number }>,
    (this: d3.BaseType | SVGPathElement, t: number) => string
  > = (data, index, group) => {
    const arcElement = group[index];

    if (!arcElement || !(arcElement instanceof SVGPathElement)) {
      console.log("arc not found");
      return () => "";
    }

    const i = d3.interpolate(currentRecord[arcElement.id], data);
    currentRecord[arcElement.id] = i(1);
    return (t) => {
      const angle = i(t);
      return arc({
        endAngle: angle.endAngle,
        innerRadius: innerRadius,
        outerRadius: outerRadius,
        startAngle: angle.startAngle,
        padAngle: angle.padAngle,
      })!;
    };
  };

  const pie = d3
    .pie()
    .sort(null)
    .value((d) => {
      return d.valueOf();
    });

  const path = svg
    .datum(data)
    .selectAll("path")
    .data(pie)
    .join("path")
    .attr("fill", (_d, i) => getColor(i))
    .attr("d", (d) =>
      arc({
        endAngle: d.endAngle,
        innerRadius: d.endAngle,
        outerRadius: outerRadius,
        startAngle: d.startAngle,
        padAngle: d.padAngle,
      })
    )
    .each(setCurrent);

  const change = (value: number[]) => {
    pie.value((_d, i) => value[i]); // change the value function
    path.data(pie); // compute the new angles
    path.transition().duration(500).attrTween("d", tween); // redraw the arcs
  };

  return {
    svg,
    change,
  };
};
const margin = 40;
const tickSize = 6;

export const drawTimeline = async (run: MyceliumInstance, width: number) => {
  const colour = performanceToColour[calcPerformance(run)];
  const maxRange = Math.max(run.actualDay, run.estimatedDay, 14);
  const svg = d3.select(".timeline").append("svg").attr("width", width);

  const xScale = d3
    .scaleLinear()
    .domain([0, maxRange + 1])
    .range([margin, width - margin]);
  const group = svg
    .append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0, 50)`)
    .call(d3.axisBottom(xScale));

  svg.select(".domain").remove();

  group
    .append("line")
    .attr("x1", xScale.range()[0])
    .attr("x2", xScale.range()[1])
    .attr("y1", tickSize / 2)
    .attr("y2", tickSize / 2)
    .attr("stroke", "var(--c-black-accent)");

  await addLocation(group, xScale, run.actualDay, colour, "current day");

  if (run.actualDay != run.estimatedDay)
    await addLocation(group, xScale, run.estimatedDay, colour, "estimated day");
};

let locationSvg: string | null = null;

export const addLocation = async <T extends d3.BaseType>(
  root: d3.Selection<T, unknown, HTMLElement, any>,
  scale: d3.ScaleLinear<number, number, never>,
  location: number,
  colour: string,
  text: string = ""
) => {
  if (!locationSvg) {
    locationSvg = await (
      await fetch("/project-mycelium-fe/icons/location.svg")
    ).text();
  }
  const g = root.append("g");
  g.append("text")
    .attr("fill", "currentColor")
    .attr("font-size", "12px")
    .attr("transform", "translate(0, -10)")
    .text(text);

  g.attr("transform", `translate(${scale(location)},  ${-24})`)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle");

  g.append("g")
    .attr("transform", "translate(-10, 0)")
    .html(locationSvg)
    .select("path")
    .attr("fill", `var(--c-${colour})`);
};

export const drawConfusionMatrix = (run: Run, width: number) => {
  width = width / 2;

  const black = "var(--c-black-accent)";

  const maxX = Math.max(...run.instances.map((d) => d.actualDay), 14);
  const maxY = 13;

  const plotSize = width - 2 * margin;
  const cellCountX = maxX + 1;
  const cellCountY = maxY + 1;

  const plotWidth = width - 2 * margin;
  const plotHeight = (plotWidth * cellCountY) / cellCountX;

  const svg = d3
    .select(".matrix")
    .html("")
    .append("svg")
    .attr("width", width)
    .attr("height", plotHeight + 2 * margin);

  const xScale = d3
    .scaleLinear()
    .domain([0, cellCountX])
    .range([margin, width - margin]);

  const yScale = d3
    .scaleLinear()
    .domain([0, cellCountY])
    .range([margin, margin * 2 + plotHeight]);

  const cellWidth = xScale(1) - xScale(0);
  const cellHeight = yScale(1) - yScale(0);

  // Axes with full-length gridlines
  svg
    .append("g")
    .attr("class", "xAxis")
    .attr("transform", `translate(0, ${margin})`)
    .call(
      d3
        .axisTop(xScale)
        .ticks(cellCountX)
        .tickFormat(d3.format("d"))
        .tickSize(-plotSize)
    );

  svg
    .append("g")
    .attr("class", "yAxis")
    .attr("transform", `translate(${margin}, 0)`)
    .call(
      d3
        .axisLeft(yScale)
        .ticks(cellCountY)
        .tickFormat(d3.format("d"))
        .tickSize(-plotSize)
    );

  // Shift x-axis labels
  svg.selectAll(".xAxis .tick").each(function (d, i, nodes) {
    const isLast = i === nodes.length - 1;
    if (!isLast) {
      d3.select(this)
        .select("text")
        .attr("x", cellWidth / 2)
        .attr("text-anchor", "middle");
    } else {
      d3.select(this).select("text").text("");
    }
  });

  // Shift y-axis labels
  svg.selectAll(".yAxis .tick").each(function (_, i, nodes) {
    const isLast = i === nodes.length - 1;
    if (!isLast) {
      d3.select(this)
        .select("text")
        .attr("y", cellHeight / 2)
        .attr("dy", "0.35em");
    } else {
      d3.select(this).select("text").text("");
    }
  });

  // Style gridlines
  svg.selectAll(".tick line").attr("stroke", "#ccc");

  // Axis Labels
  svg
    .append("text")
    .attr("class", "x axis-label")
    .attr("x", margin + plotWidth / 2)
    .attr("y", margin - 25)
    .attr("text-anchor", "middle")
    .attr("font-size", "12px")
    .attr("fill", black)
    .text("Current Day");

  svg
    .append("text")
    .attr("class", "y axis-label")
    .attr("x", -(margin + plotHeight / 2))
    .attr("y", margin - 30)
    .attr("transform", "rotate(-90)")
    .attr("text-anchor", "middle")
    .attr("font-size", "12px")
    .attr("fill", black)
    .text("Estimated Day");

  // Draw cells
  svg
    .selectAll("rect")
    .data(run.instances)
    .enter()
    .append("rect")
    .attr("x", ({ actualDay: currentDay }) => {
      return xScale(currentDay);
    })
    .attr("y", ({ estimatedDay }) => {
      return yScale(estimatedDay);
    })
    .attr("width", cellWidth)
    .attr("height", cellHeight)
    .attr("fill", (r) => {
      const colour = performanceToColour[calcPerformance(r)];
      return `var(--c-${colour})`;
    });
};
