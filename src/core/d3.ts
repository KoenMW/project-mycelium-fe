import * as d3 from "d3";
import { calcPerformance, generateId } from "./utils";
import type { MyceliumInstance } from "./types";
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
  const maxRange = Math.max(run.currentDay, run.estimatedDay, 14);
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

  await addLocation(group, xScale, run.currentDay, colour, "current day");

  if (run.currentDay != run.estimatedDay)
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
