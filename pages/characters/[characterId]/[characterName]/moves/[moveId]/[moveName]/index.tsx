import { characters } from "@/config/framedata/framedata";
import { Character, CharacterBase } from "@/models/character";
import { Move } from "@/models/move";
import { InferGetStaticPropsType, Metadata, ResolvingMetadata } from "next";
import { promises as fs } from "fs";
import { MoveGif } from "@/components/moves/move-gif";
import { BreadcrumbItem, Breadcrumbs, Card, CardBody, CardHeader, Image, Tab, Tabs } from "@nextui-org/react";
import React from "react";
import MoveAttributeTable from "@/components/moves/move-attribute-table";
import HitboxTable from "@/components/moves/hitbox-table";
import { CrouchCancelTable } from "@/components/moves/crouch-cancel-table";
import Head from "next/head";
import { MoveHead } from "@/components/moves/move-head";
import { characterRoute } from "@/utilities/routes";
import { CrouchCancelSection } from "@/components/moves/crouch-cancel-section";
import { HitboxSection } from "@/components/moves/hitbox-section";

export type MovePage = {
  character: CharacterBase;
  Move: Move;
};

async function getCharacter(name: string): Promise<Character> {
  const fileName = process.cwd() + `/config/framedata/${name.replace("%26", "&")}.json`;
  const file = await fs.readFile(fileName, "utf8");
  const character = JSON.parse(file) as Character;
  return character;
}

export async function getStaticPaths() {
  const moves = await Promise.all(
    characters.map(async (character) => {
      const enrichedCharacter = await getCharacter(character.normalizedName);
      return enrichedCharacter.moves.map((move) => ({
        characterId: character.fightCoreId.toString(),
        characterName: character.normalizedName,
        moveName: move.normalizedName,
        moveId: move.id.toString(),
      }));
    })
  );

  const flattenedMoves = moves.flat();

  return {
    paths: flattenedMoves.map((move) => ({
      params: {
        characterName: move.characterName,
        characterId: move.characterId,
        moveName: move.moveName,
        moveId: move.moveId,
      },
    })),
    fallback: false,
  };
}

export const getStaticProps = async (context: any) => {
  const characterBase = characters.find(
    (baseCharacter) => baseCharacter.fightCoreId.toString() === context?.params?.characterId
  );

  if (!characterBase) {
    return { notFound: true };
  }

  const fileName = process.cwd() + `/config/framedata/${characterBase.normalizedName.replace("%26", "&")}.json`;
  const file = await fs.readFile(fileName, "utf8");
  const character = JSON.parse(file) as Character;

  if (!character || !characterBase) {
    return { notFound: true };
  }

  const move = character.moves.find((move) => move.id.toString() === context?.params?.moveId);

  if (!move) {
    return { notFound: true };
  }

  return {
    props: {
      data: {
        character: characterBase,
        move,
      },
    },
    revalidate: false,
  };
};

export default function MoveIndexPage({ data }: Readonly<InferGetStaticPropsType<typeof getStaticProps>>) {
  return (
    <>
      <MoveHead move={data.move} character={data.character} />
      <div
        className="h-16 w-full bg-red-400 dark:bg-red-700 rounded-b-md border-b border-l border-r border-gray-700
          flex justify-center items-center mb-2"
      >
        <p className="text-4xl font-extrabold text-center">
          {data.move.name} - {data.character.name}
        </p>
      </div>
      <div>
        <Breadcrumbs>
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem href={characterRoute(data.character)}>{data.character.name}</BreadcrumbItem>
          <BreadcrumbItem>{data.move.name}</BreadcrumbItem>
        </Breadcrumbs>
      </div>
      <div className="w-full md:flex">
        <div className="w-full md:w-1/2 p-2">
          {data.move.gifUrl ? (
            <MoveGif move={data.move} characterName={data.character.normalizedName} />
          ) : (
            <em>No GIF available</em>
          )}
        </div>
        <div className="w-full md:w-1/2 p-2">
          <div className="grid grid-cols-1 gap-2 mt-2">
            <div className="bg-red-400 dark:bg-red-700 text-black dark:text-white rounded-lg p-2 text-center">
              <h2 className="text-xl font-semibold">Start</h2>
              <p>{data.move.start}</p>
            </div>
            <div className="bg-red-400 dark:bg-red-700 text-black dark:text-white rounded-lg p-2 text-center">
              <h2 className="text-xl font-semibold">End</h2>
              <p>{data.move.end}</p>
            </div>
            <div className="bg-red-400 dark:bg-red-700 text-black dark:text-white rounded-lg p-2 text-center">
              <h2 className="text-xl font-semibold">Total</h2>
              <p>{data.move.totalFrames} frames</p>
            </div>
            <div className="bg-red-400 dark:bg-red-700 text-black dark:text-white rounded-lg p-2 text-center">
              <h2 className="text-xl font-semibold">IASA</h2>
              <p>{data.move.iasa ? data.move.iasa : "-"}</p>
            </div>
            <div className="bg-red-400 dark:bg-red-700 text-black dark:text-white rounded-lg p-2 text-center">
              <h2 className="text-xl font-semibold">Notes</h2>
              <p>{data.move.notes ? data.move.notes : "-"}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="my-3">
        <h2 className="text-xl font-bold">Attributes</h2>
        <MoveAttributeTable move={data.move} />
      </div>
      <div className="my-3">
        {data.move.hitboxes?.length > 0 ? <HitboxSection hitboxes={data.move.hitboxes} /> : <></>}
      </div>
      <div>{data.move.hitboxes?.length > 0 ? <CrouchCancelSection hitboxes={data.move.hitboxes} /> : <></>}</div>
    </>
  );
}