import { FightcoreCard } from '@/components/ui/fightcore-card';
import { Character, CharacterBase } from '@/models/character';
import { Move } from '@/models/move';
import { MoveType } from '@/models/move-type';
import { canBeCrouchCanceled } from '@/utilities/crouch-cancel-calculator';
import { CrouchCancelMoveOverviewTable } from './crouch-cancel-move-overview-table';

export interface CrouchCancelMoveListParams {
  target: CharacterBase;
  character: Character;
  floorPercentage: boolean;
  knockbackTarget: number;
  staleness: number;
}

function sortMoves(moveA: Move, moveB: Move): number {
  return moveA.name.localeCompare(moveB.name);
}

export function CrouchCancelMoveList(data: Readonly<CrouchCancelMoveListParams>) {
  const moveTypes = [
    {
      type: MoveType.grounded,
      name: 'Grounded',
    },
    {
      type: MoveType.tilt,
      name: 'Tilt',
    },
    {
      type: MoveType.air,
      name: 'Air',
    },
    {
      type: MoveType.special,
      name: 'Special',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
      {moveTypes.map((type) => {
        const moves = data.character.moves
          .filter((move) => move.type === type.type && canBeCrouchCanceled(move))
          .sort(sortMoves);

        return (
          <FightcoreCard key={type.type + '-' + data.staleness}>
            <FightcoreCard.Header>
              <FightcoreCard.Title>{type.name}</FightcoreCard.Title>
            </FightcoreCard.Header>
            <FightcoreCard.Body>
              {CrouchCancelMoveOverviewTable({
                target: data.target,
                moves: moves,
                floorPercentage: data.floorPercentage,
                knockbackTarget: data.knockbackTarget,
                character: data.character,
                staleness: data.staleness,
              })}
            </FightcoreCard.Body>
          </FightcoreCard>
        );
      })}
    </div>
  );
}
