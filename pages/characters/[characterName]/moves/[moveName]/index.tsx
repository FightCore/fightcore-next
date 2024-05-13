import { characters } from '@/config/framedata/framedata';
import { Character } from '@/models/character';
import { Move } from '@/models/move';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { promises as fs } from 'fs';
import { MoveGif } from '@/components/moves/move-gif';

export type MovePage = {
  character: Character;
  Move: Move;
};

async function getCharacter(name: string): Promise<Character> {
  const fileName =
    process.cwd() + `/config/framedata/${name.replace('%26', '&')}.json`;
  const file = await fs.readFile(fileName, 'utf8');
  const character = JSON.parse(file) as Character;
  return character;
}

export async function getStaticPaths() {
  const moves = await Promise.all(
    characters.map(async (character) => {
      const enrichedCharacter = await getCharacter(character.normalizedName);
      return enrichedCharacter.moves.map((move) => ({
        characterName: character.normalizedName,
        moveName: move.normalizedName,
      }));
    })
  );

  const flattenedMoves = moves.flat();

  return {
    paths: flattenedMoves.map((move) => ({
      params: { characterName: move.characterName, moveName: move.moveName },
    })),
    fallback: false,
  };
}

export const getStaticProps = (async (context) => {
  const fileName =
    process.cwd() +
    `/config/framedata/${(context?.params?.characterName as string).replace(
      '%26',
      '&'
    )}.json`;
  const file = await fs.readFile(fileName, 'utf8');
  const character = JSON.parse(file) as Character;

  if (!character) {
    return { notFound: true };
  }

  const move = character.moves.find(
    (move) => move.normalizedName === context?.params?.moveName
  );

  if (!move) {
    return { notFound: true };
  }

  return {
    props: {
      data: {
        character,
        move,
      },
    },
    revalidate: false,
  };
}) satisfies GetStaticProps<{
  data: MovePage;
}>;

export default function MoveIndexPage({
  data,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <div className='h-16 w-full bg-red-700 rounded-b-md border-b border-l border-r border-gray-700 flex justify-center items-center mb-2'>
        <p className='text-4xl font-extrabold text-center'>
          {data.move.name} - {data.character.name}
        </p>
      </div>
      <MoveGif move={data.move} characterName={data.character.normalizedName} />
    </>
  );
}
