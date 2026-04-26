import emitter from '@/events/event-emitter';
import { Move } from '@/models/move';
import { processDuplicateHitboxes, processDuplicateHits } from '@/utilities/hitbox-utils';
import { getMappedUnique } from '@/utilities/utils';
import { useEffect, useRef, useState } from 'react';
import { flattenData, FlattenedHitbox } from './hitbox-table-columns';

export interface HitboxTimingParams {
  move: Move;
  displayLegend?: boolean;
  interactive?: boolean;
  compact?: boolean;
}

const COMPACT_LAYOUT = { barHeight: 12, activeBarHeight: 18 } as const;
const NORMAL_LAYOUT = { barHeight: 22, activeBarHeight: 32 } as const;

const SEMANTIC_COLORS = {
  iasa: '#f97316',
  autoCancel: '#22c55e',
  emptyBackground: 'var(--timeline-empty-bg)',
  labelColor: 'var(--timeline-label-color)',
  currentBorder: 'var(--timeline-current-border)',
  currentLabel: 'var(--timeline-current-label)',
} as const;

export default function HitboxTimeline(params: Readonly<HitboxTimingParams>) {
  const processedHits = processDuplicateHitboxes(params.move.hits!);
  const data = processDuplicateHits(flattenData(processedHits));
  const hitColors = generateColors(data);

  const [currentFrame, setCurrentFrame] = useState(0);
  const dragging = useRef(false);

  const layout = params.compact ? COMPACT_LAYOUT : NORMAL_LAYOUT;

  useEffect(() => {
    if (!params.interactive) return;
    const handler = (frame: number) => setCurrentFrame(frame);
    emitter.on('frameCounterUpdate', handler);
    return () => emitter.off('frameCounterUpdate', handler);
  }, [params.interactive]);

  const frames = Array.from({ length: params.move.totalFrames }, (_, i) => i + 1);

  const keyFrameNums = [...new Set([1, ...hitColors.flatMap((w) => [w.start, w.end]), params.move.totalFrames])].sort(
    (a, b) => a - b,
  );

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
        const color = isCurrent ? w.color : w.color + 'aa';
        return `${color} ${start}%, ${color} ${end}%`;
      });
      return `linear-gradient(to right, ${stops.join(', ')})`;
    }
    return isCurrent ? windows[0].color : windows[0].color + 'aa';
  };

  const getCellBorderColor = (frame: number, isCurrent: boolean, windows: HitboxColor[]): string => {
    if (
      (params.move.autoCancelBefore && params.move.autoCancelBefore > frame) ||
      (params.move.autoCancelAfter && params.move.autoCancelAfter < frame)
    ) {
      return SEMANTIC_COLORS.autoCancel;
    }
    if (windows.length) return windows[0].color + '55';
    return 'transparent';
  };

  const getLabelAnchor = (frame: number): 'left' | 'center' | 'right' => {
    if (frame === 1) return 'left';
    if (frame === params.move.totalFrames) return 'right';
    return 'center';
  };

  const getLabelColor = (frame: number): string => {
    const windows = getWindowsForFrame(hitColors, frame);
    return windows.length ? windows[0].color + 'cc' : SEMANTIC_COLORS.labelColor;
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
        className="flex gap-px select-none"
        style={{ alignItems: 'flex-end', height: layout.activeBarHeight }}
        onMouseDown={() => {
          dragging.current = true;
        }}
        onMouseUp={() => {
          dragging.current = false;
        }}
        onMouseLeave={() => {
          dragging.current = false;
        }}
      >
        {frames.map((f) => {
          const isCurrent = f === currentFrame;
          const windows = getWindowsForFrame(hitColors, f);
          return (
            <div
              key={f}
              title={`Frame ${f}`}
              style={{
                flex: '1 0 0',
                minWidth: 0,
                height: isCurrent ? layout.activeBarHeight : layout.barHeight,
                background: getCellBackground(f, isCurrent, windows),
                border: `1px solid ${getCellBorderColor(f, isCurrent, windows)}`,
                borderRadius: 2,
                transition: 'height 0.07s',
                cursor: params.interactive ? 'pointer' : 'default',
                boxShadow: isCurrent && windows.length ? `0 0 8px ${windows[0].color}88` : 'none',
              }}
              onClick={() => {
                if (params.interactive) emitter.emit('seek', f);
              }}
              onMouseMove={() => {
                if (dragging.current && params.interactive) emitter.emit('seek', f);
              }}
            />
          );
        })}
      </div>

      {!params.compact && (
        <div className="relative mt-1 h-5 font-mono text-[10px]">
          {keyFrameNums.map((f) => {
            const pct = ((f - 1) / (params.move.totalFrames - 1)) * 100;
            const anchor = getLabelAnchor(f);
            return (
              <div
                key={f}
                style={{
                  position: 'absolute',
                  left: `${pct}%`,
                  top: 0,
                  whiteSpace: 'nowrap',
                  color: getLabelColor(f),
                  transform:
                    anchor === 'center' ? 'translateX(-50%)' : anchor === 'right' ? 'translateX(-100%)' : 'none',
                  cursor: params.interactive ? 'pointer' : 'default',
                }}
                onClick={() => {
                  if (params.interactive) emitter.emit('seek', f);
                }}
              >
                {f}
              </div>
            );
          })}
          {!keyFrameNums.includes(currentFrame) && currentFrame > 0 && (
            <div
              style={{
                position: 'absolute',
                left: `${((currentFrame - 1) / (params.move.totalFrames - 1)) * 100}%`,
                top: 0,
                transform: 'translateX(-50%)',
                color: SEMANTIC_COLORS.currentLabel,
                fontWeight: 700,
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
              }}
            >
              {currentFrame}
            </div>
          )}
        </div>
      )}

      {params.displayLegend && (
        <div className="mt-3 flex flex-wrap gap-3">
          {legendData.map((item) => (
            <div key={item.label} className="flex items-center gap-1.5 text-xs">
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 2,
                  flexShrink: 0,
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

const hitboxColorPalette = ['#ef4444', '#3b82f6', '#22c55e', '#a855f7', '#ffffff'];

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
