import { CrouchCancelSection } from '@/components/moves/crouch-cancel-section';
import { HitboxSection } from '@/components/moves/hitbox-section';
import MoveAnimationDisplay from '@/components/moves/move-animation-display';
import MoveAttributeTable from '@/components/moves/move-attribute-table';
import { MoveHead } from '@/components/moves/move-head';
import { MoveSummaryTable } from '@/components/moves/move-summary-table';
import { RelevantMoves } from '@/components/moves/relevant-moves';
import SourceSection from '@/components/moves/source-section';
import { PageTitle } from '@/components/page-title';
import { FightcoreCard } from '@/components/ui/fightcore-card';
import { characters } from '@/config/framedata/framedata';
import { Character, CharacterBase } from '@/models/character';
import { Move } from '@/models/move';
import { canBeCrouchCanceled } from '@/utilities/crouch-cancel-calculator';
import { getSmallMoveSummary } from '@/utilities/move-summary';
import { createRelevantMoves } from '@/utilities/relevant-moves-creator';
import { characterRoute } from '@/utilities/routes';
import { Breadcrumbs } from '@heroui/react';
import { promises as fs } from 'fs';
import { InferGetStaticPropsType } from 'next';
import NextLink from 'next/link';

export type MovePage = {
  character: CharacterBase;
  Move: Move;
};

async function getCharacter(name: string): Promise<Character> {
  const fileName = process.cwd() + `/public/framedata/${name.replace('%26', '&')}.json`;
  const file = await fs.readFile(fileName, 'utf8');
  const character = JSON.parse(file) as Character;
  return character;
}

export async function getStaticPaths() {
  const moves = await Promise.all(
    characters.map(async (character) => {
      const enrichedCharacter = await getCharacter(character.normalizedName);
      return enrichedCharacter.moves.map((move) => ({
        characterId: character.fightCoreId.toString(),
        normalizedCharacterName: character.normalizedName,
        characterName: character.name,
        normalizedMoveName: move.normalizedName,
        moveName: move.name,
        moveId: move.id.toString(),
      }));
    }),
  );

  const flattenedMoves = moves.flat();

  const normalizedPaths = flattenedMoves.map((move) => ({
    params: {
      characterName: move.normalizedCharacterName,
      characterId: move.characterId,
      moveName: move.normalizedMoveName,
      moveId: move.moveId,
    },
  }));

  return {
    paths: [...normalizedPaths],
    fallback: false,
  };
}

function shouldDisplayFrameTimeline(move: Move): boolean {
  if (!move.hits || move.hits.length === 0) {
    return false;
  }

  if (move.hits.every((hit) => hit.start === 0 && hit.end === 0)) {
    return false;
  }

  return true;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getStaticProps = async (context: any) => {
  const characterBase = characters.find(
    (baseCharacter) => baseCharacter.fightCoreId.toString() === context?.params?.characterId,
  );

  if (!characterBase) {
    return { notFound: true };
  }

  const fileName = process.cwd() + `/public/framedata/${characterBase.normalizedName.replace('%26', '&')}.json`;
  const file = await fs.readFile(fileName, 'utf8');
  const character = JSON.parse(file) as Character;

  if (!character || !characterBase) {
    return { notFound: true };
  }

  const move = character.moves.find((move) => move.id.toString() === context?.params?.moveId);

  if (!move) {
    return { notFound: true };
  }

  const relevantMoves = createRelevantMoves(move, character);

  return {
    props: {
      data: {
        character: characterBase,
        move,
        relevantMoves,
      },
    },
    revalidate: false,
  };
};

export default function MoveIndexPage({ data }: Readonly<InferGetStaticPropsType<typeof getStaticProps>>) {
  const moveSummary = getSmallMoveSummary(data.move, data.move.hits?.flatMap((hit) => hit.hitboxes) ?? []);

  return (
    <>
      <MoveHead move={data.move} character={data.character} />
      <PageTitle title={data.character.name + ' - ' + data.move.name} />
      <div>
        <Breadcrumbs>
          <Breadcrumbs.Item>
            <NextLink href="/">Home</NextLink>
          </Breadcrumbs.Item>
          <Breadcrumbs.Item>
            <NextLink href={characterRoute(data.character)}>{data.character.name}</NextLink>
          </Breadcrumbs.Item>
          <Breadcrumbs.Item>{data.move.name}</Breadcrumbs.Item>
        </Breadcrumbs>
      </div>
      <div className="flex flex-col gap-3">
        <div className="w-full md:flex">
          <div className="w-full p-2 md:w-2/3">
            <MoveAnimationDisplay move={data.move} characterName={data.character.name}></MoveAnimationDisplay>
          </div>
          <div className="flex w-full flex-col gap-3 pb-2 md:w-1/3 md:px-2">
            <div className="w-full">
              <MoveSummaryTable moveSummary={moveSummary} />
            </div>
            <div className="hidden w-full md:block">
              <RelevantMoves relevantMoves={data.relevantMoves} />
            </div>
          </div>
        </div>

        <FightcoreCard>
          <FightcoreCard.Header>
            <FightcoreCard.Title>Attributes</FightcoreCard.Title>
          </FightcoreCard.Header>
          <FightcoreCard.Body>
            <MoveAttributeTable move={data.move} />
          </FightcoreCard.Body>
        </FightcoreCard>

        {data.move.hits && data.move.hits.length > 0 ? <HitboxSection hits={data.move.hits} /> : <></>}

        <div>{canBeCrouchCanceled(data.move) ? <CrouchCancelSection hits={data.move.hits!} /> : <></>}</div>
        <div>
          {data.move.sources && data.move.sources.length > 0 ? <SourceSection sources={data.move.sources} /> : <></>}
        </div>
      </div>
    </>
  );
}
