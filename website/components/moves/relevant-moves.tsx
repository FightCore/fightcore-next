import { RelevantMove } from '@/utilities/relevant-moves-creator';
import { Link } from '@nextui-org/link';

export interface RelevantMovesParams {
  relevantMoves: RelevantMove[];
}

export function RelevantMoves(params: Readonly<RelevantMovesParams>) {
  if (!params.relevantMoves || params.relevantMoves.length === 0) {
    return <></>;
  }
  return (
    <>
      <h2 className="text-lg font-semibold">Relevant moves</h2>
      <ul>
        {params.relevantMoves.map((move) => {
          return (
            <li key={move.url}>
              <Link href={move.url}>{move.displayName}</Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
