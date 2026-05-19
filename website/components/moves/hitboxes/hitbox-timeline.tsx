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

const NORMAL_LAYOUT = { barHeight: 22, activeBarHeight: 32 } as const;

// Minimum touch target height per Apple/Material guidelines.
const MIN_TOUCH_TARGET_PX = 44;
const MIN_LABEL_GAP_PX = 20;

const SEMANTIC_COLORS = {
  iasa: '#f97316',
  autoCancel: '#22c55e',
  emptyBackground: 'var(--timeline-empty-bg)',
  labelColor: 'var(--timeline-label-color)',
  currentBorder: 'var(--timeline-current-border)',
  currentLabel: 'var(--timeline-current-label)',
} as const;

export default function HitboxTimeline(params: Readonly<HitboxTimingParams>) {
  const processedHits = processDuplicateHitboxes(params.move.hits ?? []);
  const data = processDuplicateHits(flattenData(processedHits));
  const hitColors = generateColors(data);

  const [currentFrame, setCurrentFrame] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const dragging = useRef(false);
  const barsRef = useRef<HTMLDivElement>(null);

  const layout = NORMAL_LAYOUT;

  // Interactive timelines use a taller container so the whole region is a
  // thumb-friendly touch target. Bars align to the bottom via alignItems: flex-end.
  const containerHeight = params.interactive
    ? Math.max(layout.activeBarHeight, MIN_TOUCH_TARGET_PX)
    : layout.activeBarHeight;

  useEffect(() => {
    if (!params.interactive) return;
    const handler = (frame: number) => setCurrentFrame(frame);
    emitter.on('frameCounterUpdate', handler);
    return () => emitter.off('frameCounterUpdate', handler);
  }, [params.interactive]);

  useEffect(() => {
    const el = barsRef.current;
    if (!el) return;
    const obs = new ResizeObserver(([entry]) => setContainerWidth(entry.contentRect.width));
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const getFrameFromX = (clientX: number): number => {
    if (!barsRef.current) return 1;
    const rect = barsRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return Math.round(ratio * (params.move.totalFrames - 1)) + 1;
  };

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
    if (keyFrameNums.length > 1) result.push(keyFrameNums[keyFrameNums.length - 1]);
    return result;
  })();

  const getCellBackground = (frame: number, isCurrent: boolean, windows: HitboxColor[]): string => {
    if (windows.length === 0) {
      if (params.move.iasa === frame) {
        return SEMANTIC_COLORS.iasa;
      }

      return SEMANTIC_COLORS.emptyBackground;
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
  };

  const getCellBorderColor = (frame: number, windows: HitboxColor[]): string => {
    // Auto cancel has priority over anything.
    if (
      (params.move.autoCancelBefore && params.move.autoCancelBefore > frame) ||
      (params.move.autoCancelAfter && params.move.autoCancelAfter < frame)
    ) {
      return SEMANTIC_COLORS.autoCancel;
    }
    if (windows.length) {
      return `color-mix(in srgb, ${windows[0].color} 33%, transparent)`;
    }

    return '#525252';
  };

  const getLabelAnchor = (frame: number): 'left' | 'center' | 'right' => {
    if (frame === 1) {
      return 'left';
    }
    if (frame === params.move.totalFrames) {
      return 'right';
    }
    return 'center';
  };

  const getLabelColor = (frame: number): string => {
    const windows = getWindowsForFrame(hitColors, frame);
    return windows.length ? `color-mix(in srgb, ${windows[0].color} 80%, transparent)` : SEMANTIC_COLORS.labelColor;
  };

  const legendData: { label: string; color: string; borderColor: string }[] = [
    { label: 'IASA', color: SEMANTIC_COLORS.iasa, borderColor: 'none' },
    { label: 'Auto Cancelable', color: 'none', borderColor: SEMANTIC_COLORS.autoCancel },
  ];
  for (const color of getMappedUnique(hitColors, (c) => c.color)) {
    const matching = hitColors.filter((c) => c.color === color);
    if (matching.length) {
      legendData.push({
        label: `Hits between frame ${Math.min(...matching.map((h) => h.start))} and ${Math.max(...matching.map((h) => h.end))}`,
        color,
        borderColor: 'none',
      });
    }
  }

  return (
    <div className="w-full">
      <div
        ref={barsRef}
        className={clsx(
          'flex items-end gap-px select-none',
          params.interactive ? 'cursor-pointer touch-none' : 'cursor-default touch-auto',
        )}
        style={{ height: containerHeight }}
        onMouseDown={() => {
          dragging.current = true;
        }}
        onMouseUp={() => {
          dragging.current = false;
        }}
        onMouseLeave={() => {
          dragging.current = false;
        }}
        onClick={(e) => {
          if (params.interactive) emitter.emit('seek', getFrameFromX(e.clientX));
        }}
        onMouseMove={(e) => {
          if (dragging.current && params.interactive) emitter.emit('seek', getFrameFromX(e.clientX));
        }}
        onTouchStart={(e) => {
          if (params.interactive) {
            emitter.emit('seek', getFrameFromX(e.touches[0].clientX));
            e.preventDefault();
          }
        }}
        onTouchMove={(e) => {
          if (params.interactive) {
            emitter.emit('seek', getFrameFromX(e.touches[0].clientX));
            e.preventDefault();
          }
        }}
      >
        {frames.map((frame) => {
          const isCurrent = frame === currentFrame;
          const windows = getWindowsForFrame(hitColors, frame);
          return (
            <div
              key={frame}
              aria-hidden="true"
              className="min-w-0 flex-1 rounded-sm transition-[height] duration-70"
              style={{
                height: isCurrent ? layout.activeBarHeight : layout.barHeight,
                background: getCellBackground(frame, isCurrent, windows),
                border: `1px solid ${getCellBorderColor(frame, windows)}`,
              }}
            />
          );
        })}
      </div>

      <div className="relative mt-1 h-5 font-mono text-[10px]">
        {visibleKeyFrames.map((frame) => {
          const leftPercentage = ((frame - 1) / (params.move.totalFrames - 1)) * 100;
          const anchor = getLabelAnchor(frame);
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
                color: getLabelColor(frame),
              }}
              onClick={() => {
                if (params.interactive) emitter.emit('seek', frame);
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

function getWindowsForFrame(hitColors: HitboxColor[], frame: number): HitboxColor[] {
  if (hitColors.every((h) => h.start === 0 && h.end === 0)) {
    return [];
  }
  return hitColors.filter((h) => frame >= h.start && frame <= h.end);
}
