import emitter from '@/events/event-emitter';
import { Move } from '@/models/move';
import { processDuplicateHitboxes, processDuplicateHits } from '@/utilities/hitbox-utils';
import { getMappedUnique } from '@/utilities/utils';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { flattenData, FlattenedHitbox } from './hitbox-table-columns';

export interface HitboxTimingParams {
  move: Move;
  displayLegend?: boolean;
  interactive?: boolean;
}

// Minimum touch target height per Apple/Material guidelines.
const MIN_TOUCH_TARGET_PX = 44;
const MIN_LABEL_GAP_PX = 20;
const barHeight = 22;
const activeBarHeight = 32;

const SEMANTIC_COLORS = {
  iasa: '#f97316',
  autoCancel: '#22c55e',
  emptyBackground: 'var(--timeline-empty-bg)',
  labelColor: 'var(--timeline-label-color)',
  currentLabel: 'var(--timeline-current-label)',
} as const;

export default function HitboxTimeline(params: Readonly<HitboxTimingParams>) {
  const processedHits = processDuplicateHitboxes(params.move.hits ?? []);
  const data = processDuplicateHits(flattenData(processedHits));
  const hitColors = generateColors(data);

  const [currentFrame, setCurrentFrame] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const barsRef = useRef<HTMLDivElement>(null);

  const containerHeight = params.interactive ? Math.max(activeBarHeight, MIN_TOUCH_TARGET_PX) : activeBarHeight;

  useEffect(() => {
    if (!params.interactive) {
      return;
    }
    const handler = (frame: number) => setCurrentFrame(frame);
    emitter.on('frameCounterUpdate', handler);
    return () => emitter.off('frameCounterUpdate', handler);
  }, [params.interactive]);

  useEffect(() => {
    const el = barsRef.current;
    if (!el) {
      return;
    }
    const obs = new ResizeObserver(([entry]) => setContainerWidth(entry.contentRect.width));
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const frames = Array.from({ length: params.move.totalFrames }, (_, i) => i + 1);

  const keyFrameNums = [...new Set([1, ...hitColors.flatMap((w) => [w.start, w.end]), params.move.totalFrames])].sort(
    (a, b) => a - b,
  );

  const visibleKeyFrames = (() => {
    if (containerWidth === 0 || params.move.totalFrames <= 1) {
      return keyFrameNums;
    }

    const pxOf = (f: number) => ((f - 1) / (params.move.totalFrames - 1)) * containerWidth;
    const result: number[] = [keyFrameNums[0]];
    let lastPx = pxOf(keyFrameNums[0]);
    for (let i = 1; i < keyFrameNums.length - 1; i++) {
      const px = pxOf(keyFrameNums[i]);
      if (px - lastPx >= MIN_LABEL_GAP_PX) {
        result.push(keyFrameNums[i]);
        lastPx = px;
      }
    }
    if (keyFrameNums.length > 1) {
      result.push(keyFrameNums[keyFrameNums.length - 1]);
    }
    return result;
  })();

  const legendData: { label: string; color: string; borderColor: string }[] = [
    { label: 'IASA', color: SEMANTIC_COLORS.iasa, borderColor: 'none' },
    { label: 'Auto Cancelable', color: 'none', borderColor: SEMANTIC_COLORS.autoCancel },
  ];
  for (const color of getMappedUnique(hitColors, (c) => c.color)) {
    const matching = hitColors.filter((c) => c.color === color);
    legendData.push({
      label: `Hits between frame ${Math.min(...matching.map((h) => h.start))} and ${Math.max(...matching.map((h) => h.end))}`,
      color,
      borderColor: 'none',
    });
  }

  return (
    <div className="w-full">
      <div className="relative" style={{ height: containerHeight }}>
        <div ref={barsRef} className="pointer-events-none flex h-full items-end gap-px select-none">
          {frames.map((frame) => {
            const isCurrent = frame === currentFrame;
            const windows = getWindowsForFrame(hitColors, frame);
            return (
              <div
                key={frame}
                aria-hidden="true"
                className="min-w-0 flex-1 rounded-sm transition-[height] duration-70"
                style={{
                  height: isCurrent ? activeBarHeight : barHeight,
                  background: getCellBackground(frame, isCurrent, windows, params.move.iasa),
                  border: `1px solid ${getCellBorderColor(frame, windows, params.move.autoCancelBefore, params.move.autoCancelAfter)}`,
                }}
              />
            );
          })}
        </div>
        {params.interactive && (
          <input
            type="range"
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            min={1}
            max={params.move.totalFrames}
            value={Math.max(1, currentFrame)}
            aria-label="Frame scrubber"
            onChange={(e) => emitter.emit('seek', Number(e.target.value))}
            onKeyDown={(e) => {
              if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                e.stopPropagation();
              }
            }}
          />
        )}
      </div>

      <div className="relative mt-1 h-5 font-mono text-[10px]">
        {visibleKeyFrames.map((frame) => {
          const leftPercentage = ((frame - 1) / (params.move.totalFrames - 1)) * 100;
          const anchor = getLabelAnchor(frame, params.move.totalFrames);
          return (
            <button
              key={frame}
              type="button"
              tabIndex={params.interactive ? 0 : -1}
              aria-label={`Seek to frame ${frame}`}
              className={clsx(
                'absolute top-0 border-0 bg-transparent p-0 font-mono text-[10px] whitespace-nowrap',
                anchor === 'center' && '-translate-x-1/2',
                anchor === 'right' && '-translate-x-full',
                params.interactive ? 'cursor-pointer' : 'cursor-default',
              )}
              style={{
                left: `${leftPercentage}%`,
                color: getLabelColor(frame, hitColors),
              }}
              onClick={() => {
                if (params.interactive) {
                  emitter.emit('seek', frame);
                }
              }}
            >
              {frame}
            </button>
          );
        })}
        {!visibleKeyFrames.includes(currentFrame) && currentFrame > 0 && (
          <div
            className="pointer-events-none absolute top-0 -translate-x-1/2 font-bold whitespace-nowrap"
            style={{
              left: `${((currentFrame - 1) / (params.move.totalFrames - 1)) * 100}%`,
              color: SEMANTIC_COLORS.currentLabel,
            }}
          >
            {currentFrame}
          </div>
        )}
      </div>

      {params.displayLegend && (
        <div className="mt-3 flex flex-wrap gap-3">
          {legendData.map((item) => (
            <div key={item.label} className="flex items-center gap-1.5 text-xs">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-sm"
                style={{
                  background: item.color === 'none' ? 'transparent' : item.color,
                  border: item.borderColor !== 'none' ? `2px solid ${item.borderColor}` : 'none',
                }}
              />
              <span className="text-muted-foreground">{item.label}</span>
            </div>
          ))}
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

const hitboxColorPalette = [
  'var(--color-hit-0)',
  'var(--color-hit-1)',
  'var(--color-hit-2)',
  'var(--color-hit-3)',
  'var(--color-hit-4)',
];

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
        color: hitboxColorPalette[iterator],
      });
    }
    iterator++;
  }
  return result;
}

function getCellBackground(
  frame: number,
  isCurrent: boolean,
  windows: HitboxColor[],
  iasa: number | undefined,
): string {
  if (windows.length === 0) {
    return iasa === frame ? SEMANTIC_COLORS.iasa : SEMANTIC_COLORS.emptyBackground;
  }
  if (windows.length >= 2) {
    const stops = windows.map((w, i) => {
      const start = (i / windows.length) * 100;
      const end = ((i + 1) / windows.length) * 100;
      const color = isCurrent ? w.color : `color-mix(in srgb, ${w.color} 67%, transparent)`;
      return `${color} ${start}%, ${color} ${end}%`;
    });
    return `linear-gradient(to top, ${stops.join(', ')})`;
  }
  return isCurrent ? windows[0].color : `color-mix(in srgb, ${windows[0].color} 67%, transparent)`;
}

function getCellBorderColor(
  frame: number,
  windows: HitboxColor[],
  autoCancelBefore: number | undefined,
  autoCancelAfter: number | undefined,
): string {
  // Auto cancel has priority over anything.
  if ((autoCancelBefore && autoCancelBefore > frame) || (autoCancelAfter && autoCancelAfter < frame)) {
    return SEMANTIC_COLORS.autoCancel;
  }
  if (windows.length) {
    return `color-mix(in srgb, ${windows[0].color} 33%, transparent)`;
  }
  return '#525252';
}

function getLabelAnchor(frame: number, totalFrames: number): 'left' | 'center' | 'right' {
  if (frame === 1) {
    return 'left';
  }
  if (frame === totalFrames) {
    return 'right';
  }
  return 'center';
}

function getLabelColor(frame: number, hitColors: HitboxColor[]): string {
  const windows = getWindowsForFrame(hitColors, frame);
  return windows.length ? `color-mix(in srgb, ${windows[0].color} 80%, transparent)` : SEMANTIC_COLORS.labelColor;
}

function getWindowsForFrame(hitColors: HitboxColor[], frame: number): HitboxColor[] {
  if (hitColors.every((h) => h.start === 0 && h.end === 0)) {
    return [];
  }
  return hitColors.filter((h) => frame >= h.start && frame <= h.end);
}
