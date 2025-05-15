import * as d3 from "d3";
import { generateId } from "./utils";

type ArcElement = SVGPathElement & { current: d3.PieArcDatum<number> };

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
  const tau = 2 * Math.PI;
  const color = d3.scaleOrdinal(d3.schemeObservable10);

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

  function change(value: number[]) {
    pie.value((_d, i) => value[i]); // change the value function
    path.data(pie); // compute the new angles
    path.transition().duration(500).attrTween("d", tween); // redraw the arcs
  }

  // Store the displayed angles in _current.
  // Then, interpolate from _current to the new angles.
  // During the transition, _current is updated in-place by d3.interpolate.
  function arcTween(this: ArcElement, a: d3.PieArcDatum<number>) {
    const i = d3.interpolate(this.current, a); // `this._current` should store previous datum
    this.current = i(1); // update stored current position
    return function (t: number) {
      const angle = i(t);
      return arc({
        endAngle: angle.endAngle,
        innerRadius: innerRadius,
        outerRadius: outerRadius,
        startAngle: angle.startAngle,
        padAngle: angle.padAngle,
      })!;
    };
  }
  // Return the svg node to be displayed.
  return {
    svg,
    change,
  };
};
