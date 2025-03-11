import { CrouchCancelCalculatorHead } from '@/components/head/crouch-cancel-calculator-head';
import { CrouchCancelMoveList } from '@/components/moves/crouch-cancel/crouch-cancel-move-list';
import StalenessQueue from '@/components/moves/crouch-cancel/staleness-queue';
import { PageTitle } from '@/components/page-title';
import { characters } from '@/config/framedata/framedata';
import { LOCAL_STORAGE_PREFERRED_CC_FLOOR } from '@/keys/local-storage-keys';
import { Character, CharacterBase } from '@/models/character';
import { Knockback } from '@/types/knockback';
import { Checkbox } from '@heroui/checkbox';
import { Image } from '@heroui/image';
import { Radio, RadioGroup } from '@heroui/radio';
import { Select, SelectItem } from '@heroui/select';
import { promises as fs } from 'fs';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
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

  function setSelectedChangeTarget(keys: Set<Key> | 'all') {
    if (keys == 'all') {
      throw new Error('Invalid all case');
    }
    const value = keys.values().next();
    const character = characters.find((character) => character.fightCoreId === Number(value.value));
    if (!character || character === target) {
      return;
    }
    setTarget(character);
    setSelectedTarget(character.fightCoreId);
  }

  function setSelectedAttacker(keys: Set<Key> | 'all') {
    if (keys == 'all') {
      throw new Error('Invalid all case');
    }
    const value = keys.values().next();
    const character = characters.find((character) => character.fightCoreId === Number(value.value));
    setSelectedCharacter(character!.normalizedName.replace('%26', '&'));
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
      // If the flooring value wasn't set before, use true to prevent confusion.
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
        <Select
          items={characters}
          label="Attacker"
          placeholder="Select the target that should crouch cancel the move"
          className="w-full"
          classNames={{
            trigger: 'dark:bg-gray-800',
            listboxWrapper: 'dark:bg-gray-900',
          }}
          defaultSelectedKeys={[characterData.fightCoreId.toString()]}
          onSelectionChange={setSelectedAttacker}
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

        <div>
          <Select
            items={characters}
            label="Target"
            placeholder="Select the target that should crouch cancel the move"
            className="w-full"
            classNames={{
              trigger: 'dark:bg-gray-800',
              listboxWrapper: 'dark:bg-gray-900',
            }}
            selectedKeys={selectedTarget ? [selectedTarget.toString()] : []}
            onSelectionChange={setSelectedChangeTarget}
            defaultSelectedKeys={target ? [target.fightCoreId.toString()] : []}
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
        </div>
      </div>
      <div className="grid grid-cols-1 gap-7 lg:grid-cols-3">
        <div>
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
        </div>
        <div>
          <div className="mb-1 text-medium text-foreground-500">Staleness</div>
          <StalenessQueue onStalenessChange={setStaleness}></StalenessQueue>
        </div>

        <div>
          <div className="mb-1 text-medium text-foreground-500">Ceiling percentages</div>
          <Checkbox isSelected={floorPercentages} onValueChange={setFlooringChange}>
            <div className="text-small">
              Melee uses floored percentages for its calculations, if a move breaks at 11.10%, it means it breaks at
              12%.
            </div>
            <div className="text-small">
              <em>More information on this coming soon.</em>
            </div>
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
