import { MoveCard } from '@/components/moves/move-card';
import { characters } from '@/config/framedata/framedata';
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
  const character = JSON.parse(file);
  return (
    <>
      <Head>
        {character.moves.slice(5).map((move: any) => (
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
      <h1>{character.name}</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        {character.moves.map((move: any, index: number) => (
          <div key={move.normalizedName}>
            <MoveCard
              characterName={character.normalizedName}
              move={move}
              lazy={index > 5}
            />
          </div>
        ))}
      </div>
    </>
  );
}
