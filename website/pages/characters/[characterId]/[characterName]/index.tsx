import { CharacterHead } from '@/components/characters/character-head';
import { MoveCard } from '@/components/moves/move-card';
import { PageTitle } from '@/components/page-title';
import { characters } from '@/config/framedata/framedata';
import { Character } from '@/models/character';
import { Move } from '@/models/move';
import { MoveType } from '@/models/move-type';
import { Button, ButtonGroup } from '@heroui/button';
import { Input } from '@heroui/input';
import { promises as fs } from 'fs';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { useMemo, useState } from 'react';

export type CharacterPage = {
  character: Character | null;
};

export async function getStaticPaths() {
  const normalizedPaths = characters.map((character) => {
    return { params: { characterName: character.normalizedName, characterId: character.fightCoreId.toString() } };
  });
  return {
    paths: [...normalizedPaths],
    fallback: false,
  };
}

export const getStaticProps = (async (context) => {
  const characterBase = characters.find(
    (baseCharacter) => baseCharacter.fightCoreId.toString() === context?.params?.characterId,
  );

  if (!characterBase) {
    return { notFound: true };
  }

  const fileName = process.cwd() + `/public/framedata/${characterBase.normalizedName.replace('%26', '&')}.json`;
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

export default function CharacterPage({ data }: InferGetStaticPropsType<typeof getStaticProps>) {
  const [searchQuery, setSearchQuery] = useState('');

  const moveTypes = [
    {
      type: MoveType.grounded,
      name: 'Grounded',
      sorting: ['jab1', 'jab2', 'jab3', 'rjab', 'dattack', 'usmash', 'fsmash', 'fsmash2', 'dsmash'],
      showInSidebar: true,
    },
    {
      type: MoveType.tilt,
      name: 'Tilt',
      sorting: ['ftilt', 'uaft', 'daft', 'utilt', 'dtilt'],
      showInSidebar: true,
    },
    {
      type: MoveType.air,
      name: 'Air',
      sorting: ['nair', 'uair', 'bair', 'fair', 'dair'],
      showInSidebar: true,
    },
    {
      type: MoveType.special,
      name: 'Special',
      sorting: ['neutralb', 'aneutralb', 'sideb', 'asideb', 'downb', 'adownb', 'upb', 'aupb'],
      showInSidebar: true,
    },
    {
      type: MoveType.throw,
      name: 'Grab/Throw',
      sorting: [
        'grab',
        'dashgrab',
        'pummel',
        'fthrow',
        'bthrow',
        'uthrow',
        'dthrow',
        'cargo_fthrow',
        'cargo_bthrow',
        'cargo_uthrow',
        'cargo_dthrow',
      ],
      showInSidebar: true,
    },
    {
      type: MoveType.dodge,
      name: 'Dodge',
      sorting: ['spotdodge', 'airdodge', 'rollbackwards', 'rollforward'],
      showInSidebar: true,
    },
    {
      type: MoveType.tech,
      name: 'Getups/Techs',
      sorting: ['neutraltech', 'ftechroll', 'btechroll'],
      showInSidebar: true,
    },
    {
      type: MoveType.edgeAttack,
      name: 'Edge',
      showInSidebar: true,
      sorting: [
        'edge',
        'edgeslow',
        'edgeclimb',
        'edgeclimbslow',
        'edgeroll',
        'edgerollslow',
        'edgejump',
        'edgejumpslow',
      ],
    },
    { type: MoveType.item, name: 'Item', showInSidebar: false },
    {
      type: MoveType.kirbySpecial,
      name: 'Copy Abilities',
      sorting: [
        'bowserspecial',
        'captainfalconspecial',
        'donkeykongspecial',
        'drmariospecial',
        'falcospecial',
        'foxspecial',
        'ganondorfspecial',
        'iceclimbersspecial',
        'jigglypuffspecial',
        'linkspecial',
        'luigispecial',
        'mariospecial',
        'marthspecial',
        'mewtwospecial',
        'mrgameandwatchspecial',
        'nessspecial',
        'peachspecial',
        'pichuspecial',
        'pikachuspecial',
        'royspecial',
        'samusspecial',
        'sheikspecial',
        'yoshispecial',
        'younglinkspecial',
        'zeldaspecial',
      ],
      showInSidebar: false,
    },
    {
      type: MoveType.unknown,
      name: 'Uncategorised',
      showInSidebar: false,
    },
  ];

  const { filteredCategories, movesByCategory } = useMemo(() => {
    const map = new Map<MoveType, Move[]>();
    const categories = [];

    for (const moveType of moveTypes) {
      let moves = data.character.moves.filter((move) => move.type === moveType.type);

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        moves = moves.filter(
          (move) => move.name.toLowerCase().includes(query) || move.normalizedName.toLowerCase().includes(query),
        );
      }

      if (moves.length > 0) {
        if (moveType.sorting) {
          moves.sort((a, b) => moveType.sorting.indexOf(a.normalizedName) - moveType.sorting.indexOf(b.normalizedName));
        }
        map.set(moveType.type, moves);
        categories.push(moveType);
      }
    }

    return { filteredCategories: categories, movesByCategory: map };
  }, [searchQuery, data.character.moves]);

  return (
    <>
      <CharacterHead character={data.character} />
      <PageTitle title={data.character.name} />
      <div className="flex justify-between pt-2">
        <div>
          <Input
            variant="bordered"
            isClearable
            type="text"
            placeholder="Search moves..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-md"
          />
        </div>
        <div className="hidden xl:block">
          <ButtonGroup>
            {moveTypes
              .filter((moveType) => moveType.showInSidebar)
              .map((moveType) => (
                <Button
                  key={moveType.type}
                  onPress={() => {
                    const element = document.getElementById(`category-${moveType.type}`);
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                >
                  {moveType.name}
                </Button>
              ))}
          </ButtonGroup>
        </div>
      </div>

      {filteredCategories.map((moveType) => (
        <div key={moveType.type} id={`category-${moveType.type}`}>
          <h2 className="py-5 text-left text-xl font-semibold">{moveType.name}</h2>
          <div className="grid grid-cols-1 gap-2">
            {movesByCategory.get(moveType.type)!.map((move: Move, index: number) => (
              <div className="flex flex-grow" key={move.normalizedName}>
                <MoveCard character={data.character} move={move} lazy={index > 5} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
