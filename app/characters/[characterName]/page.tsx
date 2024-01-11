import { MoveCard } from '@/components/moves/move-card';
import { characters } from '@/config/framedata/framedata';
import { promises as fs } from 'fs';

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
