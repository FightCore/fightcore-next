import emitter from '@/events/event-emitter';
import { Move } from '@/models/move';
import { processDuplicateHitboxes, processDuplicateHits } from '@/utilities/hitbox-utils';
import { getMappedUnique } from '@/utilities/utils';
import * as d3 from 'd3';
import { useTheme } from 'next-themes';
import { useEffect } from 'react';
import { flattenData, FlattenedHitbox } from './hitbox-table-columns';

export interface HitboxTimingParams {
  move: Move;
  displayLegend?: boolean;
  interactive?: boolean;
  compact?: boolean;
}

export default function HitboxTimeline(params: Readonly<HitboxTimingParams>) {
  const processedHits = processDuplicateHitboxes(params.move.hits!);
  const data = processDuplicateHits(flattenData(processedHits));
  const colors = generateColors(data);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { theme } = useTheme();

  const getColor = (value: number): string => {
    // Account for counting at 0 instead of 1
    const color = getHitboxColor(colors, value);

    if (color) {
      return color;
    }

    if (params.move.iasa == value) {
      return 'orange';
    }

    if (theme === 'dark') {
      return '#1f2937';
    }
    return '#dddde0';
  };

  const getBorderColor = (frame: number): string => {
    if (
      (params.move.autoCancelBefore && params.move.autoCancelBefore > frame) ||
      (params.move.autoCancelAfter && params.move.autoCancelAfter < frame)
    ) {
      return 'green';
    }

    return '';
  };
  const frames: {
    value: number;
    color: string;
    borderColor: string;
  }[] = [];

  const rectSize = params.compact ? 20 : 30; // Size of each rectangle (reduced size)
  const spacing = params.compact ? 2.5 : 5; // Spacing between rectangles
  const maxColumns = params.compact ? 30 : 20; // Maximum number of columns

  for (let frame = 1; frame < params.move.totalFrames + 1; frame++) {
    frames.push({
      value: frame,
      color: getColor(frame),
      borderColor: getBorderColor(frame),
    });
  }
  const drawTimeline = () => {
    const timelineContainer = d3.select('#d3-based-hitbox-timeline-' + params.move.id);

    // Clear any existing SVG elements
    timelineContainer.selectAll('*').remove();

    const node = timelineContainer.node() as Element | null;

    if (node === null) {
      throw new Error('Node is unexpected null');
    }

    const containerWidth = node.clientWidth;
    const columns = Math.min(Math.floor(containerWidth / (rectSize + spacing)), maxColumns);
    const rows = Math.ceil(frames.length / columns);
    const svgWidth = columns * (rectSize + spacing);
    const svgHeight = 10 + rows * (rectSize + spacing);

    const svg = timelineContainer.append('svg').attr('width', svgWidth).attr('height', svgHeight);

    // Legend data
    if (params.displayLegend) {
      const legendData = [
        { label: 'IASA', color: 'orange', borderColor: 'none' },
        { label: 'Auto Cancelable', color: 'none', borderColor: 'green' },
      ];

      for (const color of getMappedUnique(colors, (color) => color.color)) {
        const value = colors.filter((storedColor) => storedColor.color === color);
        if (value) {
          legendData.push({
            label: `Hits between frame ${Math.min(...value.map((hitbox) => hitbox.start))} and ${Math.max(
              ...value.map((hitbox) => hitbox.end),
            )}`,
            color: color,
            borderColor: 'none',
          });
        }
      }

      const legendContainer = d3.select('#d3-based-legend');

      // Clear any existing SVG elements
      legendContainer.selectAll('*').remove();

      // Legend SVG
      const legendSvg = legendContainer
        .append('svg')
        .attr('width', 300)
        .attr('height', 100 + legendData.length * rectSize);

      legendSvg
        .selectAll('rect')
        .data(legendData)
        .enter()
        .append('rect')
        .attr('x', 10)
        .attr('y', (d, i) => 10 + i * 40)
        .attr('width', rectSize)
        .attr('height', rectSize)
        .attr('fill', (d) => d.color)
        .attr('stroke', (d) => d.borderColor)
        .attr('stroke-width', 2)
        .attr('rx', 5) // Rounded corners for a nicer look
        .attr('ry', 5); // Rounded corners for a nicer look

      legendSvg
        .selectAll('text')
        .data(legendData)
        .enter()
        .append('text')
        .text((d) => d.label)
        .attr('x', 60)
        .attr('y', (d, i) => 30 + i * 40)
        .attr('font-family', 'sans-serif')
        .attr('font-size', '14px')
        .attr('fill', () => (theme === 'dark' ? 'white' : 'black'))
        .attr('alignment-baseline', 'middle');
    }

    svg
      .selectAll('rect')
      .data(frames)
      .enter()
      .append('rect')
      .attr('x', (d, i) => (i % columns) * (rectSize + spacing))
      .attr('y', (d, i) => 10 + Math.floor(i / columns) * (rectSize + spacing))
      .attr('width', rectSize)
      .attr('height', rectSize)
      .attr('fill', (d) => d.color)
      .attr('stroke', (d) => d.borderColor)
      .attr('stroke-width', 2)
      .attr('rx', 5)
      .attr('ry', 5)
      .attr('cursor', () => (params.interactive ? 'pointer' : ''))
      .on('click', function () {
        if (!params.interactive) {
          return;
        }
        const index = d3.select(this).datum() as { value: number };
        emitter.emit('seek', index.value);
      });

    svg
      .selectAll('text')
      .data(frames)
      .enter()
      .append('text')
      .text((d) => d.value.toString())
      .attr('x', (d, i) => (i % columns) * (rectSize + spacing) + rectSize / 2)
      .attr('y', (d, i) => 10 + Math.floor(i / columns) * (rectSize + spacing) + rectSize / 2)
      .attr('font-family', 'sans-serif')
      .attr('font-size', '12px') // Adjusted font size
      .attr('fill', (d) => (d.color === '#ffffff' || theme === 'light' ? 'black' : 'white'))
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .attr('cursor', () => (params.interactive ? 'pointer' : ''))
      .on('click', function () {
        if (!params.interactive) {
          return;
        }
        const index = d3.select(this).datum() as { value: number };
        emitter.emit('seek', index.value);
      });
  };

  useEffect(() => {
    drawTimeline();

    // Add event listener for window resize
    const handleResize = () => {
      drawTimeline();
    };

    window.addEventListener('resize', handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [frames]);

  return (
    <div className="flex flex-wrap">
      <div className={params.displayLegend ? 'w-screen lg:w-2/3' : 'w-full'}>
        {params.compact === false && <h2 className="text-bold text-lg">Hitbox timeline</h2>}
        <div id={'d3-based-hitbox-timeline-' + params.move.id}></div>
      </div>
      {params.displayLegend && (
        <div className="w-screen lg:w-1/3">
          <h2 className="text-bold text-lg">Legend</h2>
          <div id="d3-based-legend"></div>
        </div>
      )}
    </div>
  );
}

interface HitboxColor {
  start: number;
  end: number;
  color: string;
}

const colors = ['#ef4444', '#3b82f6', '#22c55e', '#a855f7', '#ffffff'];

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
