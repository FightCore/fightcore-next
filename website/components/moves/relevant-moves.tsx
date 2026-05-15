import { FightcoreCard } from '@/components/ui/fightcore-card';
import { RelevantMove } from '@/utilities/relevant-moves-creator';
import { Link } from '@heroui/react';

export interface RelevantMovesParams {
  relevantMoves: RelevantMove[];
}

export function RelevantMoves(params: Readonly<RelevantMovesParams>) {
  if (!params.relevantMoves || params.relevantMoves.length === 0) {
    return <></>;
  }
  return (
    <FightcoreCard>
      <FightcoreCard.Header>
        <FightcoreCard.Title>Relevant moves</FightcoreCard.Title>
      </FightcoreCard.Header>
      <FightcoreCard.Body>
        <ul>
          {params.relevantMoves.map((move) => {
            return (
              <li key={move.url}>
                <Link href={move.url}>{move.displayName}</Link>
              </li>
            );
          })}
        </ul>
      </FightcoreCard.Body>
    </FightcoreCard>
  );
}
