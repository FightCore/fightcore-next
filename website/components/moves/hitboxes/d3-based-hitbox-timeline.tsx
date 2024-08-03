import React, { useEffect } from "react";
import * as d3 from "d3";
import { Move } from "@/models/move";
import { processDuplicateHitboxes, processDuplicateHits } from "@/utilities/hitbox-utils";
import { flattenData, FlattenedHitbox } from "./hitbox-table-columns";
import { getMappedUnique, getUnique } from "@/utilities/utils";

export interface D3HitboxTimingParams {
  move: Move;
}

export default function D3BasedHitboxTimeline(params: Readonly<D3HitboxTimingParams>) {
  const processedHits = processDuplicateHitboxes(params.move.hits!);
  const data = processDuplicateHits(flattenData(processedHits));
  const colors = generateColors(data);

  const getColor = (value: number): string => {
    // Account for counting at 0 instead of 1
    const color = getHitboxColor(colors, value);

    if (color) {
      return color;
    }

    if (params.move.iasa == value) {
      return "orange";
    }

    return "#1f2937";
  };

  const getBorderColor = (frame: number): string => {
    if (
      (params.move.autoCancelBefore && params.move.autoCancelBefore > frame) ||
      (params.move.autoCancelAfter && params.move.autoCancelAfter < frame)
    ) {
      return "green";
    }

    return "";
  };
  const frames: {
    value: number;
    color: string;
    borderColor: string;
  }[] = [];

  const columns = 10; // Number of columns in the grid
  const rectSize = 30; // Size of each rectangle (reduced size)
  const spacing = 5; // Spacing between rectangles
  const maxColumns = 20; // Maximum number of columns

  for (let frame = 1; frame < params.move.totalFrames + 1; frame++) {
    frames.push({
      value: frame,
      color: getColor(frame),
      borderColor: getBorderColor(frame),
    });
  }
  const drawTimeline = () => {
    const container = d3.select("#d3-based-hitbox-timeline");

    // Clear any existing SVG elements
    container.selectAll("*").remove();

    const containerWidth = container.node().clientWidth;
    const columns = Math.min(Math.floor(containerWidth / (rectSize + spacing)), maxColumns);
    const rows = Math.ceil(frames.length / columns);
    const svgWidth = columns * (rectSize + spacing);
    const svgHeight = rows * (rectSize + spacing);

    const svg = container.append("svg").attr("width", svgWidth).attr("height", svgHeight);

    // Legend data
    const legendData = [
      { label: "IASA", color: "orange", borderColor: "none" },
      { label: "Auto Cancelable", color: "none", borderColor: "green" },
    ];

    const grouping = Object.groupBy(colors, (c) => c.color);
    for (const color of getMappedUnique(colors, (color) => color.color)) {
      const value = grouping[color];
      if (value) {
        legendData.push({
          label: `Hits between frame ${Math.min(...value.map((hitbox) => hitbox.start))} and ${Math.max(
            ...value.map((hitbox) => hitbox.end)
          )}`,
          color: color,
          borderColor: "none",
        });
      }
    }

    // Add legend container
    const legendContainer = container.append("div").attr("class", "legend");

    // Legend SVG
    const legendSvg = legendContainer
      .append("svg")
      .attr("width", 300)
      .attr("height", 100 + legendData.length * rectSize);

    legendSvg
      .selectAll("rect")
      .data(legendData)
      .enter()
      .append("rect")
      .attr("x", 10)
      .attr("y", (d, i) => 10 + i * 40)
      .attr("width", rectSize)
      .attr("height", rectSize)
      .attr("fill", (d) => d.color)
      .attr("stroke", (d) => d.borderColor)
      .attr("stroke-width", 2)
      .attr("rx", 5) // Rounded corners for a nicer look
      .attr("ry", 5); // Rounded corners for a nicer look

    legendSvg
      .selectAll("text")
      .data(legendData)
      .enter()
      .append("text")
      .text((d) => d.label)
      .attr("x", 60)
      .attr("y", (d, i) => 30 + i * 40)
      .attr("font-family", "sans-serif")
      .attr("font-size", "14px")
      .attr("fill", "white")
      .attr("alignment-baseline", "middle");

    svg
      .selectAll("rect")
      .data(frames)
      .enter()
      .append("rect")
      .attr("x", (d, i) => (i % columns) * (rectSize + spacing))
      .attr("y", (d, i) => Math.floor(i / columns) * (rectSize + spacing))
      .attr("width", rectSize)
      .attr("height", rectSize)
      .attr("fill", (d) => d.color)
      .attr("stroke", (d) => d.borderColor)
      .attr("stroke-width", 2)
      .attr("rx", 5) // Rounded corners for a nicer look
      .attr("ry", 5); // Rounded corners for a nicer look

    svg
      .selectAll("text")
      .data(frames)
      .enter()
      .append("text")
      .text((d) => d.value.toString())
      .attr("x", (d, i) => (i % columns) * (rectSize + spacing) + rectSize / 2)
      .attr("y", (d, i) => Math.floor(i / columns) * (rectSize + spacing) + rectSize / 2)
      .attr("font-family", "sans-serif")
      .attr("font-size", "12px") // Adjusted font size
      .attr("fill", "white")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle");
  };

  useEffect(() => {
    drawTimeline();

    // Add event listener for window resize
    const handleResize = () => {
      drawTimeline();
    };

    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [frames]);

  return (
    <div style={{ display: "flex" }}>
      <div id="d3-based-hitbox-timeline" style={{ width: "80%" }}></div>
      <div className="legend"></div>
    </div>
  );
}

interface HitboxColor {
  start: number;
  end: number;
  color: string;
}

const colors = ["#ef4444", "#3b82f6"];

function generateColors(data: FlattenedHitbox[]): HitboxColor[] {
  const result: HitboxColor[] = [];
  const uniqueTexts = getMappedUnique(data, (hitbox) => hitbox.hit);
  let iterator = 0;
  for (const text of uniqueTexts) {
    const firstHitbox = data.find((hitbox) => hitbox.hit === text);
    if (!firstHitbox) {
      continue;
    }
    for (const hit of firstHitbox.hitObjects) {
      result.push({
        start: hit.start,
        end: hit.end,
        color: colors[iterator],
      });
    }
    iterator++;
  }

  return result;
}

function getHitboxColor(hits: HitboxColor[], frame: number): string | null {
  if (hits.every((hit) => hit.start === 0 && hit.end === 0)) {
    return null;
  }

  const index = hits.findIndex((hit) => frame >= hit.start && frame <= hit.end);

  if (index == -1) {
    return null;
  }

  return hits[index].color;
}
