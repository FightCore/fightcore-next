import { CrouchCancelCalculatorHead } from '@/components/head/crouch-cancel-calculator-head';
import CrouchCancelCharacterSwitches from '@/components/moves/crouch-cancel/crouch-cancel-character-switcher';
import { CrouchCancelMoveList } from '@/components/moves/crouch-cancel/crouch-cancel-move-list';
import { PageTitle } from '@/components/page-title';
import { characters } from '@/config/framedata/framedata';
import { LOCAL_STORAGE_PREFERRED_CC_FLOOR } from '@/keys/local-storage-keys';
import { Character, CharacterBase } from '@/models/character';
import { Knockback } from '@/types/knockback';
import { Checkbox } from "@heroui/checkbox";
import { Image } from "@heroui/image";
import { Radio, RadioGroup } from "@heroui/radio";
import { Select, SelectItem } from "@heroui/select";
import { promises as fs } from 'fs';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { Key, useEffect, useState } from 'react';

export type CrouchCancelCharacterPage = {
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

  const fileName = process.cwd() + `/config/framedata/${characterBase.normalizedName.replace('%26', '&')}.json`;
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
  data: CrouchCancelCharacterPage;
}>;

export default function CrouchCancelCalculatorCharacterPage({ data }: InferGetStaticPropsType<typeof getStaticProps>) {
  const [target, setTarget] = useState<CharacterBase | null>(null);
  const [mode, setMode] = useState<Knockback>(120);

  function setSelectedValue(keys: Set<Key> | 'all') {
    if (keys == 'all') {
      throw new Error('Invalid all case');
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
    if (typeof window !== 'undefined' && window.localStorage) {
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
      <CrouchCancelCalculatorHead character={data.character} />

      <PageTitle title={`${data.character.name} Crouch Cancel Calculator`} />

      <div className="grid grid-cols-1 gap-7 lg:grid-cols-2">
        <div>
          <h2 className="mb-5 text-xl font-bold">Select your character</h2>
          <div className="grid grid-cols-5 gap-1 md:grid-cols-10">
            <CrouchCancelCharacterSwitches />
          </div>
        </div>

        <div>
          <h2 className="mb-5 text-xl font-bold">Options</h2>
          <Select
            items={characters}
            label="Target"
            placeholder="Select the target that should crouch cancel the move"
            className="mb-5 w-full"
            classNames={{
              trigger: 'dark:bg-gray-800',
              listboxWrapper: 'dark:bg-gray-900',
            }}
            onSelectionChange={setSelectedValue}
          >
            {(character) => (
              <SelectItem
                className="dark:bg-gray-800"
                startContent={
                  <Image alt={character.name} width={20} height={20} src={'/newicons/' + character.name + '.webp'} />
                }
                key={character.fightCoreId}
              >
                {character.name}
              </SelectItem>
            )}
          </Select>

          <RadioGroup
            value={mode.toString()}
            onValueChange={setModeChange}
            label="Select calculator mode"
            orientation="horizontal"
            className="mb-5 text-white"
          >
            <Radio value="120">Crouch Cancel</Radio>
            <Radio value="80">ASDI Down</Radio>
          </RadioGroup>

          <div className="mb-1 text-medium text-foreground-500">Floor percentages</div>
          <Checkbox isSelected={floorPercentages} onValueChange={setFlooringChange}>
            <div className="text-small">
              Melee uses floored percentages for its calculations, un-floored percentages can be viewed but should not
              be used.
            </div>
          </Checkbox>
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
