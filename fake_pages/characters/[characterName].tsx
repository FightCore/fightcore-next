import { MoveCard } from '@/components/moves/move-card';
import { characters } from '@/config/framedata/framedata';
import { Character } from '@/models/character';
import { Move } from '@/models/move';
import { MoveType } from '@/models/move-type';
import { promises as fs } from 'fs';
import Head from 'next/head';

export function generateStaticParams() {
  return characters.map((character) => {
    return { characterName: character.normalizedName };
  });
}

export default async function Character({
  params,
}: {
  params: { characterName: string };
}) {
  const file = await fs.readFile(
    process.cwd() +
      `/config/framedata/${params.characterName.replace('%26', '&')}.json`,
    'utf8'
  );
  const character = JSON.parse(file) as Character;
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
    {
      type: MoveType.throw,
      name: 'Throw',
    },
    { type: MoveType.dodge, name: 'Dodge' },
    {
      type: MoveType.unknown,
      name: 'Uncategorised',
    },
  ];

  const movesByCategory = new Map<MoveType, Move[]>();

  for (const moveType of moveTypes) {
    movesByCategory.set(
      moveType.type,
      character.moves.filter((move) => move.type === moveType.type)
    );
  }

  return (
    <>
      <Head>
        {character.moves.slice(5).map((move: Move) => (
          <link
            key={move.normalizedName}
            rel='preload'
            as='image'
            href={
              'https://i.fightcore.gg/melee/moves/' +
              params.characterName +
              '/' +
              move.normalizedName +
              '.webm'
            }
          />
        ))}
      </Head>
      <div className='h-16 w-full bg-red-700 rounded-b-md border-b border-l border-r border-gray-700 flex justify-center items-center mb-2'>
        <p className='text-4xl font-extrabold text-center'>{character.name}</p>
      </div>
      {moveTypes.map((moveType) => (
        <div key={moveType.type}>
          <div className='h-16 w-full bg-gray-800 rounded border border-gray-800 flex justify-center items-center my-4'>
            <p className='text-2xl font-bold text-center'>{moveType.name}</p>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {movesByCategory
              .get(moveType.type)!
              .map((move: any, index: number) => (
                <div className='flex flex-grow' key={move.normalizedName}>
                  <MoveCard
                    characterName={character.normalizedName}
                    move={move}
                    lazy={index > 5}
                  />
                </div>
              ))}
          </div>
        </div>
      ))}
    </>
  );
}
