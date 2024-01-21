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
      <div className='h-16 w-full bg-gray-600 rounded border border-black flex place-content-center mb-2'>
        <h1 className='text-4xl w-full h-full text-center'>{character.name}</h1>
      </div>
      {moveTypes.map((moveType) => (
        <div key={moveType.type}>
          <div className='h-16 w-full bg-gray-800 rounded border border-black flex place-content-center my-4'>
            <h1 className='text-2xl w-full h-full text-center'>
              {moveType.name}
            </h1>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            {movesByCategory
              .get(moveType.type)!
              .map((move: any, index: number) => (
                <div key={move.normalizedName}>
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
