import { characters } from "@/config/framedata/framedata";
import { Character, CharacterBase } from "@/models/character";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import slugify from "slugify";
import { promises as fs } from "fs";
import { Select, SelectItem } from "@nextui-org/select";
import { Key, useEffect, useState } from "react";
import { crouchCancelCharacterRoute } from "@/utilities/routes";
import { Tooltip } from "@nextui-org/tooltip";
import { Link } from "@nextui-org/link";
import { Image } from "@nextui-org/image";
import { CrouchCancelMoveList } from "@/components/moves/crouch-cancel/crouch-cancel-move-list";
import { RadioGroup, Radio } from "@nextui-org/radio";
import { Checkbox } from "@nextui-org/checkbox";
import { LOCAL_STORAGE_PREFERRED_CC_FLOOR } from "@/keys/local-storage-keys";
import { Knockback } from "@/types/knockback";
import CrouchCancelCharacterSwitches from "@/components/moves/crouch-cancel/crouch-cancel-character-switcher";

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
  const [mode, setMode] = useState<Knockback>(120);

  function setSelectedValue(keys: Set<Key> | "all") {
    if (keys == "all") {
      throw new Error("Invalid all case");
    }
    const value = keys.values().next();
    const character = characters.find((character) => character.fightCoreId === Number(value.value));
    setTarget(character!);
  }

  const [floorPercentages, setFloorPercentages] = useState(true);
  const setFlooringChange = (value: boolean) => {
    setFloorPercentages(value);
    localStorage.setItem(LOCAL_STORAGE_PREFERRED_CC_FLOOR, String(value));
  };

  const setModeChange = (value: string) => {
    const valueAsNumber = parseInt(value) as Knockback;
    setMode(valueAsNumber);
  };

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const flooredText = localStorage.getItem(LOCAL_STORAGE_PREFERRED_CC_FLOOR);
      // If the flooring value wasn't set before, use true to prevent confusion.
      if (flooredText === null) {
        setFlooringChange(true);
      }

      const floor = !!flooredText;
      setFloorPercentages(floor);
    }
  }, [setFloorPercentages]);

  return (
    <>
      <div
        className="h-16 w-full bg-gray-200 dark:bg-gray-800 rounded border
    border-gray-300 dark:border-gray-800 flex justify-center items-center mb-4"
      >
        <p className="text-2xl font-bold text-center">{data.character.name} Crouch Cancel Calculator</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div>
          <h2 className="text-xl font-bold mb-2">Select your character</h2>
          <div className="grid grid-cols-10">
            <CrouchCancelCharacterSwitches />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2">Options</h2>
          <Select
            items={characters}
            label="Target"
            placeholder="Select the target that should crouch cancel the move"
            className="w-full"
            classNames={{
              trigger: "dark:bg-gray-800",
              listboxWrapper: "dark:bg-gray-900",
            }}
            onSelectionChange={setSelectedValue}
          >
            {(character) => (
              <SelectItem
                className="dark:bg-gray-800"
                startContent={
                  <Image alt={character.name} width={20} height={20} src={"/newicons/" + character.name + ".webp"} />
                }
                key={character.fightCoreId}
              >
                {character.name}
              </SelectItem>
            )}
          </Select>
          <div className="grid grid-cols-1 md:grid-cols-2">
            <RadioGroup
              value={mode.toString()}
              onValueChange={setModeChange}
              label="Select calculator mode"
              orientation="horizontal"
            >
              <Radio value="120">Crouch Cancel</Radio>
              <Radio value="80">ASDI Down</Radio>
            </RadioGroup>
            <Checkbox isSelected={floorPercentages} onValueChange={setFlooringChange}>
              <div className="text-medium font-bold">Floor percentages</div>
              <div className="text-small">
                Melee uses floored percentages for its calculations, un-floored percentages can be viewed but should not
                be used.
              </div>
            </Checkbox>
          </div>
        </div>
      </div>

      {target ? (
        CrouchCancelMoveList({
          target: target,
          character: data.character,
          floorPercentage: floorPercentages,
          knockbackTarget: mode,
        })
      ) : (
        <></>
      )}
    </>
  );
}
