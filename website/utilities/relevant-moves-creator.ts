import { Character } from '@/models/character';
import { Move } from '@/models/move';
import { moveRoute } from './routes';

export interface RelevantMove {
  displayName: string;
  url: string;
}

const relevantMoves = [
  ['jab1', 'jab2', 'jab3', 'rjab', 'dattack'],
  ['fsmash', 'usmash', 'dsmash', 'fsmash2'],
  ['upb', 'sideb', 'downb', 'neutralb'],
  ['aupb', 'asideb', 'adownb', 'aneutralb'],
  ['ftilt', 'utilt', 'dtilt'],
  ['fair', 'dair', 'uair', 'bair', 'zair'],
  ['grab', 'dashgrab', 'fthrow', 'uthrow', 'bthrow', 'dthrow'],
  ['airdodge', 'spotdodge', 'rollforward', 'rollbackwards'],
];

export function createRelevantMoves(move: Move, character: Character): RelevantMove[] {
  const relatedMoves = relevantMoves.find((groupedMoves) => groupedMoves.includes(move.normalizedName));
  if (!relatedMoves) {
    return [];
  }

  const moves = character.moves.filter(
    (storedMove) =>
      relatedMoves.findIndex((relatedMove) => storedMove.normalizedName === relatedMove) !== -1 &&
      storedMove.normalizedName !== move.normalizedName,
  );

  return moves.map((relatedMove) => ({
    displayName: relatedMove.name,
    url: moveRoute(character, relatedMove),
  }));
}
