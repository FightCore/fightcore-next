import { FightcoreCard } from '@/components/ui/fightcore-card';
import { Button } from '@heroui/react';

export interface SearchResult {
  id: number;
  characterId: number;
  moveId: number;
  character: string;
  move: string;
  normalizedCharacterName: string;
  normalizedMoveName: string;
  image: string;
  title: string;
  description: string;
  start: number | null;
  end: number | null;
  totalFrames: number | null;
  damage: string[] | null;
  angle: number | null;
  baseKnockback: number[] | null;
  knockbackGrowth: number[] | null;
  setKnockback: number[] | null;
  landLag: number | null;
  lCancelledLandLag: number | null;
  iASA: number | null;
  autoCancelBefore: number | null;
  autoCancelAfter: number | null;
  notes: string | null;
}

interface SearchResultCardProps {
  result: SearchResult;
  onNavigate: () => void;
}

export function SearchResultCard({ result, onNavigate }: SearchResultCardProps) {
  const moveUrl = `/characters/${result.characterId}/${encodeURIComponent(result.normalizedCharacterName)}/moves/${result.moveId}/${encodeURIComponent(result.normalizedMoveName)}/`;
  const stats = generateStats(result);
  return (
    <FightcoreCard className="flex h-full flex-col">
      <FightcoreCard.Header>
        <FightcoreCard.Title>{result.move}</FightcoreCard.Title>
      </FightcoreCard.Header>
      <FightcoreCard.Body className="min-h-0 flex-1 overflow-y-auto">
        <div>
          {result.image !== null && <img src={result.image} height={200} alt={result.move} className="w-full" />}
        </div>
        <div className="flex flex-col">
          {stats.map((stat, index) => {
            return (
              <div className="flex flex-row justify-between">
                <div className="text-muted text-sm">{stat.name}</div>
                <div className="bg-surface-secondary px-1 font-mono text-sm">{stat.value}</div>
              </div>
            );
          })}
        </div>
      </FightcoreCard.Body>
      <FightcoreCard.Footer>
        <Button className="w-full">View full data</Button>
      </FightcoreCard.Footer>
    </FightcoreCard>
    // <Card.Root className="w-full p-2 transition-colors">
    //   <Card.Content className="p-2">
    //     <div className="mb-2 flex gap-2">
    //       <Image alt={result.character} width={40} height={40} src={'/newicons/' + result.character + '.webp'} />
    //       <div>
    //         <h4 className="text-default-700 truncate font-semibold">{result.move}</h4>
    //         <p className="text-default-500 text-sm">{result.character}</p>
    //       </div>
    //     </div>
    //     <div className="flex flex-wrap gap-2">
    //       <div>
    //         {result.image !== null && (
    //           <img src={result.image} height={200} alt={result.move} className="max-h-[200px]" />
    //         )}
    //       </div>
    //       <div className="">
    //         <div className="min-w-0 flex-1">
    //           <div className="text-default-500 mt-1 flex flex-col flex-wrap">
    //             {result.start !== null && (
    //               <span>
    //                 <span className="font-semibold">Start:</span> {result.start}
    //               </span>
    //             )}
    //             {result.end !== null && (
    //               <span>
    //                 <span className="font-semibold">End:</span> {result.end}
    //               </span>
    //             )}
    //             {result.damage && result.damage?.length > 0 && (
    //               <span>
    //                 <span className="font-semibold">Damage:</span> {result.damage.join(' / ')}
    //               </span>
    //             )}
    //             {result.baseKnockback && result.baseKnockback?.length > 0 && (
    //               <span>
    //                 <span className="font-semibold">Base knockback:</span> {result.baseKnockback.join(' / ')}
    //               </span>
    //             )}
    //             {result.knockbackGrowth && result.knockbackGrowth?.length > 0 && (
    //               <span>
    //                 <span className="font-semibold">Knockback growth:</span> {result.knockbackGrowth.join(' / ')}
    //               </span>
    //             )}
    //             {result.setKnockback && result.setKnockback?.length > 0 && (
    //               <span>
    //                 <span className="font-semibold">Set knockback:</span> {result.setKnockback.join(' / ')}
    //               </span>
    //             )}

    //             {result.notes !== null && (
    //               <span>
    //                 <span className="font-semibold">Notes:</span> {result.notes}
    //               </span>
    //             )}
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </Card.Content>
    // </Card.Root>
  );
}

function generateStats(result: SearchResult): { name: string; value: string }[] {
  const results = [];

  if (result.start) {
    results.push({ name: 'Start', value: result.start.toString() });
  }
  if (result.end) {
    results.push({ name: 'End', value: result.end.toString() });
  }
  if (result.totalFrames) {
    results.push({ name: 'Total', value: result.totalFrames.toString() });
  }
  if (result.damage) {
    results.push({ name: 'Damage', value: result.damage.map((damage) => damage + '%').join(', ') });
  }

  return results;
}
