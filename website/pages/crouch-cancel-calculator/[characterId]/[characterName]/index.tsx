import { CrouchCancelCalculatorHead } from '@/components/head/crouch-cancel-calculator-head';
import { CrouchCancelMoveList } from '@/components/moves/crouch-cancel/crouch-cancel-move-list';
import StalenessQueue from '@/components/moves/crouch-cancel/staleness-queue';
import { PageTitle } from '@/components/page-title';
import { characters } from '@/config/framedata/framedata';
import { LOCAL_STORAGE_PREFERRED_CC_FLOOR } from '@/keys/local-storage-keys';
import { Character, CharacterBase } from '@/models/character';
import { Knockback } from '@/types/knockback';
import { Checkbox, ListBox, ListBoxItem, Radio, RadioGroup, Select } from '@heroui/react';
import { promises as fs } from 'fs';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

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
  data: CrouchCancelCharacterPage;
}>;

export default function CrouchCancelCalculatorCharacterPage({ data }: InferGetStaticPropsType<typeof getStaticProps>) {
  const [selectedCharacter, setSelectedCharacter] = useState<string>(data.character.normalizedName.replace('%26', '&'));
  const [characterData, setCharacterData] = useState<Character | null>(data.character);
  const [selectedTarget, setSelectedTarget] = useState<number | null>(null);
  const [target, setTarget] = useState<CharacterBase | null>(null);
  const [mode, setMode] = useState<Knockback>(120);
  const [staleness, setStaleness] = useState<number>(0);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const queryParamTarget = searchParams.get('target');
    if (queryParamTarget) {
      if (target) {
        return;
      }
      const character = characters.find((character) => character.normalizedName === queryParamTarget);
      if (!character) {
        return;
      }
      setSelectedTarget(character.fightCoreId);
      setTarget(character);
    }
  }, [searchParams]);

  useEffect(() => {
    setCharacterData(null);
    fetch(`/framedata/${selectedCharacter}.json`)
      .then((jsonData) => jsonData.json())
      .then((jsonData) => {
        const character = jsonData as Character;
        setCharacterData(character);
      });
  }, [selectedCharacter]);

  function setSelectedChangeTarget(key: React.Key | null) {
    if (!key) return;
    const character = characters.find((character) => character.fightCoreId === Number(key));
    if (!character || character === target) {
      return;
    }
    setTarget(character);
    setSelectedTarget(character.fightCoreId);
  }

  function setSelectedAttacker(key: React.Key | null) {
    if (!key) return;
    const character = characters.find((character) => character.fightCoreId === Number(key));
    if (character) setSelectedCharacter(character.normalizedName.replace('%26', '&'));
  }

  useEffect(() => {
    if (characterData === null || target === null) {
      return;
    }
    let path = `/crouch-cancel-calculator/${characterData?.fightCoreId}/${characterData?.normalizedName}`;
    if (target) {
      path += '?target=' + target.normalizedName;
    }

    if (path === router.asPath) {
      return;
    }
    router.push(
      {
        pathname: `/crouch-cancel-calculator/[characterId]/[characterName]`,
        query: {
          characterId: characterData.fightCoreId,
          characterName: characterData.normalizedName,
        },
      },
      path,
      { shallow: true },
    );
  }, [characterData, target, router]);

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
      if (flooredText === null) {
        setFlooringChange(true);
      }

      const floor = !!flooredText;
      setFloorPercentages(floor);
    }
  }, [setFloorPercentages, characterData]);

  if (characterData === null) {
    return <>Loading...</>;
  }

  return (
    <>
      <CrouchCancelCalculatorHead character={characterData} />

      <div className="pb-2">
        <PageTitle title={`${characterData.name} Crouch Cancel Calculator`} />
      </div>

      <div className="grid grid-cols-1 gap-7 lg:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Attacker</label>
          <Select
            aria-label="Attacker"
            className="w-full"
            defaultSelectedKey={characterData.fightCoreId.toString()}
            onSelectionChange={setSelectedAttacker}
          >
            <Select.Trigger className="dark:bg-gray-800">
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover className="dark:bg-gray-900">
              <ListBox>
                {characters.map((character) => (
                  <ListBoxItem
                    key={character.fightCoreId.toString()}
                    id={character.fightCoreId.toString()}
                    textValue={character.name}
                    className="dark:bg-gray-800"
                  >
                    <div className="flex items-center gap-2">
                      <Image
                        alt={character.name}
                        width={20}
                        height={20}
                        src={'/newicons/' + character.name + '.webp'}
                      />
                      {character.name}
                    </div>
                  </ListBoxItem>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Target</label>
          <Select
            aria-label="Target"
            className="w-full"
            selectedKey={selectedTarget ? selectedTarget.toString() : ''}
            onSelectionChange={setSelectedChangeTarget}
          >
            <Select.Trigger className="dark:bg-gray-800">
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover className="dark:bg-gray-900">
              <ListBox>
                {characters.map((character) => (
                  <ListBoxItem
                    key={character.fightCoreId.toString()}
                    id={character.fightCoreId.toString()}
                    textValue={character.name}
                    className="dark:bg-gray-800"
                  >
                    <div className="flex items-center gap-2">
                      <Image
                        alt={character.name}
                        width={20}
                        height={20}
                        src={'/newicons/' + character.name + '.webp'}
                      />
                      {character.name}
                    </div>
                  </ListBoxItem>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-7 lg:grid-cols-3">
        <div>
          <div className="text-medium mb-1 font-bold">Select calculator mode</div>
          <RadioGroup
            value={String(mode)}
            onChange={setModeChange}
            aria-label="Calculator mode"
            orientation="horizontal"
            className="flex gap-3"
          >
            <Radio value="120">
              <Radio.Control>
                <Radio.Indicator />
              </Radio.Control>
              <Radio.Content>Crouch Cancel</Radio.Content>
            </Radio>
            <Radio value="80">
              <Radio.Control>
                <Radio.Indicator />
              </Radio.Control>
              <Radio.Content>ASDI Down</Radio.Content>
            </Radio>
          </RadioGroup>
        </div>
        <div>
          <div className="text-medium text-foreground-500 mb-1">Staleness</div>
          <StalenessQueue onStalenessChange={setStaleness}></StalenessQueue>
        </div>

        <div>
          <div className="text-medium text-foreground-500 mb-1">Ceiling percentages</div>
          <Checkbox className="dark:text-white" isSelected={floorPercentages} onChange={setFlooringChange}>
            <Checkbox.Control>
              <Checkbox.Indicator />
            </Checkbox.Control>
            <Checkbox.Content>
              <div className="text-small">
                Melee uses floored percentages for its calculations, if a move breaks at 11.10%, it means it breaks at
                12%.
              </div>
              <div className="text-small">
                <em>More information on this coming soon.</em>
              </div>
            </Checkbox.Content>
          </Checkbox>
        </div>
      </div>

      {target ? (
        CrouchCancelMoveList({
          target: target,
          character: characterData!,
          floorPercentage: floorPercentages,
          knockbackTarget: mode,
          staleness: staleness,
        })
      ) : (
        <></>
      )}
    </>
  );
}
