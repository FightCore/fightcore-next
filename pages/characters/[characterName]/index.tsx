import { MoveCard } from '@/components/moves/move-card';
import { characters } from '@/config/framedata/framedata';
import { Character } from '@/models/character';
import { Move } from '@/models/move';
import { MoveType } from '@/models/move-type';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { promises as fs } from 'fs';
import { Breadcrumbs, BreadcrumbItem } from '@nextui-org/react';

export type CharacterPage = {
  character: Character | null;
};

export async function getStaticPaths() {
  return {
    paths: characters.map((character) => {
      return { params: { characterName: character.normalizedName } };
    }),
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
  return {
    props: {
      data: {
        character,
      },
    },
    revalidate: false,
  };
}) satisfies GetStaticProps<{
  data: CharacterPage;
}>;

export default function CharacterPage({
  data,
}: InferGetStaticPropsType<typeof getStaticProps>) {
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
      data.character.moves.filter((move) => move.type === moveType.type)
    );
  }
  return (
    <>
      <div className='h-16 w-full bg-red-700 rounded-b-md border-b border-l border-r border-gray-700 flex justify-center items-center mb-2'>
        <p className='text-4xl font-extrabold text-center'>
          {data.character.name}
        </p>
      </div>
      <Breadcrumbs>
        <BreadcrumbItem href='/'>Home</BreadcrumbItem>
        <BreadcrumbItem href={'/characters/' + data.character.normalizedName}>
          {data.character.name}
        </BreadcrumbItem>
      </Breadcrumbs>
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
                    characterName={data.character.normalizedName}
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
