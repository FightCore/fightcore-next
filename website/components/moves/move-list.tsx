import { MoveCard } from '@/components/moves/move-card';
import { CharacterBase } from '@/models/character';
import { Move } from '@/models/move';
import { MoveType } from '@/models/move-type';
import { useState } from 'react';
import { FaAngleDown, FaAngleRight } from 'react-icons/fa6';

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
    <div id={data.id}>
      <h2 className="py-2 text-left text-xl font-semibold">
        <button className="flex items-center gap-1" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? (
            <FaAngleRight className="h-4 w-4"></FaAngleRight>
          ) : (
            <FaAngleDown className="h-4 w-4"></FaAngleDown>
          )}
          <span>{data.name}</span>
        </button>
      </h2>
      <div className="grid grid-cols-1 gap-2">
        {data.moves.map((move: Move, index: number) => (
          <div className={collapsed ? 'hidden' : 'flex flex-grow'} key={move.normalizedName}>
            <MoveCard character={data.character} move={move} lazy={data.lazy || index > 5} />
          </div>
        ))}
      </div>
    </div>
  );
}
