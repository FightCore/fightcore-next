import { characters } from '@/config/framedata/framedata';
import { promises as fs } from 'fs';

export async function generateStaticParams() {
  const result = [];
  for (const character of characters) {
    const file = await fs.readFile(
      process.cwd() +
        `/config/framedata/${character.normalizedName.replace(
          '%26',
          '&'
        )}.json`,
      'utf8'
    );
    const data = JSON.parse(file);
    result.push(
      ...data.moves.map((move: any) => {
        return {
          characterName: character.normalizedName,
          moveName: move.normalizedName,
        };
      })
    );
  }

  return result;
}

export default async function Move({
  params,
}: {
  params: { characterName: string; moveName: string };
}) {
  const file = await fs.readFile(
    process.cwd() +
      `/config/framedata/${params.characterName.replace('%26', '&')}.json`,
    'utf8'
  );
  const character = JSON.parse(file);
  const move = character.moves.find(
    (storedMove: any) => storedMove.normalizedName === params.moveName
  );
  return (
    <>
      <h1>{character.name}</h1>
      <h2>{move.name}</h2>
    </>
  );
}
