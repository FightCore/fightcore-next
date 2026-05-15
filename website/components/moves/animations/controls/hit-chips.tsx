import { flattenData } from '@/components/moves/hitboxes/hitbox-table-columns';
import { Move } from '@/models/move';
import { generateHexColors, processDuplicateHitboxes, processDuplicateHits } from '@/utilities/hitbox-utils';

export interface HitChipProps {
  move: Move;
}

export const HitChips = ({ move }: HitChipProps) => {
  if (!move.hits || move.hits.length === 0) {
    return <span> No hits</span>;
  }
  const processedHits = processDuplicateHitboxes(move.hits);
  const data = processDuplicateHits(flattenData(processedHits));
  const colors = generateHexColors(data);

  return (
    <div className="flex flex-row flex-wrap gap-1.5">
      {processedHits.map((hit) => {
        const colorObj = colors.find((c) => c.start === hit.start && c.end === hit.end);
        const colorHex = colorObj?.color ?? '#888888';
        return (
          <div
            key={hit.id}
            className="flex items-center gap-1.5 rounded px-2 py-0.5 font-mono text-[11px] font-semibold whitespace-nowrap"
            style={{
              background: colorHex + '1a',
              border: `1px solid ${colorHex}4d`,
              color: colorHex,
            }}
          >
            <span className="h-2 w-2 shrink-0 rounded-sm" style={{ background: colorHex }} />
            {hit.name ?? `f${hit.start}–${hit.end}`}
          </div>
        );
      })}
    </div>
  );
};
