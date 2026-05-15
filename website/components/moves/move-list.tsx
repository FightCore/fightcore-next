import { MoveCard } from '@/components/moves/move-card';
import { FightcoreCard } from '@/components/ui/fightcore-card';
import { CharacterBase } from '@/models/character';
import { Move } from '@/models/move';
import { MoveType } from '@/models/move-type';
import { useState } from 'react';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa6';

export interface MoveListData {
  name: string;
  type: MoveType;
  moves: Move[];
  character: CharacterBase;
  lazy: boolean;
  id: string;
}

export default function MoveList(data: Readonly<MoveListData>) {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  return (
    <FightcoreCard id={data.id}>
      <FightcoreCard.Header>
        <FightcoreCard.Title>
          <button
            className="flex h-full w-full cursor-pointer items-center justify-between gap-1"
            onClick={() => setCollapsed(!collapsed)}
          >
            <span>{data.name}</span>
            <div className="float-right">
              {collapsed ? (
                <FaAngleDown className="h-4 w-4"></FaAngleDown>
              ) : (
                <FaAngleUp className="h-4 w-4"></FaAngleUp>
              )}
            </div>
          </button>
        </FightcoreCard.Title>
      </FightcoreCard.Header>

      <FightcoreCard.Body className={collapsed ? 'hidden' : ''}>
        <div className="grid grid-cols-1 gap-2">
          {data.moves.map((move: Move, index: number) => (
            <div className="border-divider -mx-4 flex grow border-b" key={move.normalizedName}>
              <MoveCard character={data.character} move={move} lazy={data.lazy || index > 5} />
            </div>
          ))}
        </div>
      </FightcoreCard.Body>
    </FightcoreCard>
  );
}
