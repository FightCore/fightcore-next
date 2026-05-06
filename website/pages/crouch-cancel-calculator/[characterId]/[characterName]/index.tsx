import { CrouchCancelCalculatorHead } from '@/components/head/crouch-cancel-calculator-head';
import { CrouchCancelMoveList } from '@/components/moves/crouch-cancel/crouch-cancel-move-list';
import StalenessQueue from '@/components/moves/crouch-cancel/staleness-queue';
import { PageTitle } from '@/components/page-title';
import { FightcoreCard } from '@/components/ui/fightcore-card';
import { characters } from '@/config/framedata/framedata';
import { LOCAL_STORAGE_PREFERRED_CC_FLOOR } from '@/keys/local-storage-keys';
import { Character, CharacterBase } from '@/models/character';
import { Knockback } from '@/types/knockback';
import { Checkbox, Description, Label, ListBox, ListBoxItem, Select, Tabs } from '@heroui/react';
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

      <div>
        <PageTitle title={`${characterData.name} Crouch Cancel Calculator`} />
      </div>

      <div className="py-3">
        <FightcoreCard>
          <FightcoreCard.Header className="w-full">
            <div className="flex w-full justify-between gap-3">
              <div className="flex-1">
                <Select
                  aria-label="Attacker"
                  className="w-full"
                  variant="secondary"
                  defaultSelectedKey={characterData.fightCoreId.toString()}
                  onSelectionChange={setSelectedAttacker}
                >
                  <Label>Attacker</Label>
                  <Select.Trigger>
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      {characters.map((character) => (
                        <ListBoxItem
                          key={character.fightCoreId.toString()}
                          id={character.fightCoreId.toString()}
                          textValue={character.name}
                          className=""
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
              <div className="place-content-center">VS</div>

              <div className="flex-1">
                <Select
                  aria-label="Target"
                  variant="secondary"
                  className="w-full"
                  selectedKey={selectedTarget ? selectedTarget.toString() : ''}
                  onSelectionChange={setSelectedChangeTarget}
                >
                  <Label>Target</Label>
                  <Select.Trigger>
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      {characters.map((character) => (
                        <ListBoxItem
                          key={character.fightCoreId.toString()}
                          id={character.fightCoreId.toString()}
                          textValue={character.name}
                          className=""
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
          </FightcoreCard.Header>
          <FightcoreCard.Body>
            <div className="flex justify-evenly gap-3">
              <div className="flex-1">
                <div className="">Mode</div>
                <Tabs
                  aria-label="Calculator mode"
                  selectedKey={String(mode)}
                  onSelectionChange={(key) => setModeChange(String(key))}
                >
                  <Tabs.ListContainer>
                    <Tabs.List>
                      <Tabs.Tab key="120" id="120">
                        Crouch Cancel
                        <Tabs.Indicator />
                      </Tabs.Tab>
                      <Tabs.Tab key="80" id="80">
                        ASDI Down
                        <Tabs.Indicator />
                      </Tabs.Tab>
                    </Tabs.List>
                  </Tabs.ListContainer>
                </Tabs>
              </div>
              <div className="flex-1">
                <div className="text-medium text-foreground-500 mb-1">Staleness</div>
                <StalenessQueue onStalenessChange={setStaleness}></StalenessQueue>
              </div>

              <div className="flex-1">
                <div className="mb-1 text-sm">Ceiling percentages</div>
                <Checkbox className="dark:text-white" isSelected={floorPercentages} onChange={setFlooringChange}>
                  <Checkbox.Control>
                    <Checkbox.Indicator />
                  </Checkbox.Control>
                  <Checkbox.Content>
                    <Label htmlFor="feature">Floored percentages</Label>
                    <Description>11.10% will display as 12%</Description>
                    {/* <div className="text-small">
                      Melee uses floored percentages for its calculations, if a move breaks at 11.10%, it means it
                      breaks at 12%.
                    </div>
                    <div className="text-small">
                      <em>More information on this coming soon.</em>
                    </div> */}
                  </Checkbox.Content>
                </Checkbox>
              </div>
            </div>
          </FightcoreCard.Body>
        </FightcoreCard>
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
