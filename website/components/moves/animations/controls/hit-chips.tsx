import { flattenData } from '@/components/moves/hitboxes/hitbox-table-columns';
import { Move } from '@/models/move';
import { generateColors, processDuplicateHitboxes, processDuplicateHits } from '@/utilities/hitbox-utils';

export interface HitChipProps {
  move: Move;
}

export const HitChips = ({ move }: HitChipProps) => {
  if (!move.hits || move.hits.length === 0) {
    return <span> No hits</span>;
  }
  const processedHits = processDuplicateHitboxes(move.hits);
  const data = processDuplicateHits(flattenData(processedHits));
  const colors = generateColors(data);

  return (
    <div className="flex flex-row gap-2">
      {processedHits.map((hit) => {
        const color = colors.find((color) => color.start === hit.start && color.end === hit.end);
        return (
          <div key={hit.id}>
            <div className={'mr-1 inline-block h-3 w-3 border border-black ' + color?.color}></div>
            <div className="inline">{hit.name ?? 'f-' + hit.start + ' - f-' + hit.end}</div>
          </div>
        );
      })}
    </div>
  );
};
