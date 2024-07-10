import { characters } from "@/config/framedata/framedata";
import { Character, CharacterBase } from "@/models/character";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import slugify from "slugify";
import { promises as fs } from "fs";
import { Select, SelectSection, SelectItem } from "@nextui-org/select";
import { Key, useMemo, useState } from "react";
import { calculateCrouchCancelPercentage } from "@/utilities/crouch-cancel-calculator";
import { characterRoute, crouchCancelCharacterRoute } from "@/utilities/routes";
import { Tooltip } from "@nextui-org/tooltip";
import { Link } from "@nextui-org/link";
import { Image } from "@nextui-org/image";
import { Card, CardBody, CardHeader } from "@nextui-org/card";

export type CrouchCancelCharacterPage = {
  character: Character | null;
};

export async function getStaticPaths() {
  const normalizedPaths = characters.map((character) => {
    return { params: { characterName: character.normalizedName, characterId: character.fightCoreId.toString() } };
  });
  const nonNormalizedPaths = characters.map((character) => {
    return { params: { characterName: slugify(character.name), characterId: character.fightCoreId.toString() } };
  });
  return {
    paths: [...normalizedPaths, ...nonNormalizedPaths],
    fallback: false,
  };
}

export const getStaticProps = (async (context) => {
  const characterBase = characters.find(
    (baseCharacter) => baseCharacter.fightCoreId.toString() === context?.params?.characterId
  );

  if (!characterBase) {
    return { notFound: true };
  }

  const fileName = process.cwd() + `/config/framedata/${characterBase.normalizedName.replace("%26", "&")}.json`;
  const file = await fs.readFile(fileName, "utf8");
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
  data: CrouchCancelCharacterPage;
}>;

export default function CrouchCancelCalculatorCharacterPage({ data }: InferGetStaticPropsType<typeof getStaticProps>) {
  const [target, setTarget] = useState<CharacterBase | null>(null);

  function setSelectedValue(keys: Set<Key> | "all") {
    if (keys == "all") {
      throw new Error("Invalid all case");
    }

    console.log(keys);
    const value = keys.values().next();
    const character = characters.find((character) => character.fightCoreId === Number(value.value));
    setTarget(character!);
  }

  return (
    <>
      <div
        className="h-16 w-full bg-gray-200 dark:bg-gray-800 rounded border
    border-gray-300 dark:border-gray-800 flex justify-center items-center mb-4"
      >
        <p className="text-2xl font-bold text-center">{data.character.name} Crouch Cancel Calculator</p>
      </div>
      <div className="grid grid-cols-10">
        {characters.map((character) => (
          <div key={character.normalizedName}>
            <Tooltip content={character.name} delay={1000}>
              <Link href={crouchCancelCharacterRoute(character)}>
                <Image
                  className="grow"
                  alt={character.name}
                  width={40}
                  height={40}
                  src={"/newicons/" + character.name + ".webp"}
                />
              </Link>
            </Tooltip>
          </div>
        ))}
      </div>

      <Select
        items={characters}
        label="Target"
        placeholder="Select the target that should crouch cancel the move"
        className="max-w-xs"
        onSelectionChange={setSelectedValue}
      >
        {(character) => <SelectItem key={character.fightCoreId}>{character.name}</SelectItem>}
      </Select>
      <div className="grid grid-cols-4 gap-2">
        {target ? (
          <>
            {data.character.moves.map((move) => {
              if (!move.hitboxes || move.hitboxes.length === 0) return <></>;
              return (
                <div key={move.id}>
                  <Card className="max-w-[340px] dark:bg-gray-800">
                    <CardHeader className="text-lg text-bold">{move.name}</CardHeader>
                    <CardBody>
                      {move.hitboxes?.map((hitbox) => (
                        <div key={hitbox.id}>
                          <strong>{hitbox.name}</strong> {calculateCrouchCancelPercentage(hitbox, target!, 120, true)}
                        </div>
                      ))}
                    </CardBody>
                  </Card>
                </div>
              );
            })}
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}
