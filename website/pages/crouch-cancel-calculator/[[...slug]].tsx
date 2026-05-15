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
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

export type CrouchCancelCharacterPage = {
  character: Character | null;
};

export async function getStaticPaths() {
  const characterPaths = characters.map((character) => ({
    params: { slug: [character.fightCoreId.toString(), character.normalizedName] },
  }));
  return {
    paths: [{ params: { slug: [] } }, ...characterPaths],
    fallback: false,
  };
}

export async function getStaticProps(context: { params?: { slug?: string[] } }) {
  const slug = context.params?.slug ?? [];

  if (slug.length === 0) {
    return { props: { data: { character: null } } };
  }

  const characterBase = characters.find((c) => c.fightCoreId.toString() === slug[0]);
  if (!characterBase) {
    return { notFound: true };
  }

  const fileName = process.cwd() + `/public/framedata/${characterBase.normalizedName.replace('%26', '&')}.json`;
  const file = await fs.readFile(fileName, 'utf8');
  const character = JSON.parse(file) as Character;

  return {
    props: { data: { character } },
    revalidate: false,
  };
}

function buildPath(character: Character | CharacterBase, target: CharacterBase | null): string {
  let path = `/crouch-cancel-calculator/${character.fightCoreId}/${character.normalizedName}`;
  if (target) path += '?target=' + target.normalizedName;
  return path;
}

function pushRoute(
  router: ReturnType<typeof useRouter>,
  character: Character | CharacterBase,
  target: CharacterBase | null,
) {
  router.push(
    {
      pathname: '/crouch-cancel-calculator/[[...slug]]',
      query: { slug: [character.fightCoreId.toString(), character.normalizedName] },
    },
    buildPath(character, target),
    { shallow: true },
  );
}

export default function CrouchCancelCalculatorPage({ data }: Readonly<{ data: CrouchCancelCharacterPage }>) {
  const initialCharacter = data.character;
  const [characterData, setCharacterData] = useState<Character | null>(initialCharacter);
  const [selectedTarget, setSelectedTarget] = useState<number | null>(null);
  const [target, setTarget] = useState<CharacterBase | null>(null);
  const [mode, setMode] = useState<Knockback>(120);
  const [staleness, setStaleness] = useState<number>(0);
  const [floorPercentages, setFloorPercentages] = useState(true);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const queryParamTarget = searchParams.get('target');
    if (queryParamTarget && !target) {
      const character = characters.find((c) => c.normalizedName === queryParamTarget);
      if (character) {
        setSelectedTarget(character.fightCoreId);
        setTarget(character);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const flooredText = localStorage.getItem(LOCAL_STORAGE_PREFERRED_CC_FLOOR);
      if (flooredText === null) {
        setFlooringChange(true);
        return;
      }
      setFloorPercentages(flooredText === 'true');
    }
  }, []);

  const setFlooringChange = (value: boolean) => {
    setFloorPercentages(value);
    localStorage.setItem(LOCAL_STORAGE_PREFERRED_CC_FLOOR, String(value));
  };

  function onAttackerChange(key: React.Key | null) {
    if (!key) {
      return;
    }
    const character = characters.find((c) => c.fightCoreId === Number(key));
    if (!character) {
      return;
    }
    const normalizedName = character.normalizedName.replace('%26', '&');
    if (normalizedName === characterData?.normalizedName.replace('%26', '&')) return;

    setCharacterData(null);
    pushRoute(router, character, target);
    fetch(`/framedata/${normalizedName}.json`)
      .then((response) => response.json())
      .then((json) => setCharacterData(json as Character));
  }

  function onTargetChange(key: React.Key | null) {
    if (!key) return;
    const character = characters.find((c) => c.fightCoreId === Number(key));
    if (!character || character === target) return;
    setTarget(character);
    setSelectedTarget(character.fightCoreId);
    if (characterData) {
      pushRoute(router, characterData, character);
    }
  }

  const characterList = characters.map((character) => (
    <ListBoxItem
      key={character.fightCoreId.toString()}
      id={character.fightCoreId.toString()}
      textValue={character.name}
    >
      <div className="flex items-center gap-2">
        <Image alt={character.name} width={20} height={20} src={'/newicons/' + character.name + '.webp'} />
        {character.name}
      </div>
    </ListBoxItem>
  ));

  const title = characterData ? `${characterData.name} Crouch Cancel Calculator` : 'Crouch Cancel Calculator';

  return (
    <>
      {characterData && <CrouchCancelCalculatorHead character={characterData} />}

      <PageTitle title={title} />

      <div className="py-3">
        <FightcoreCard>
          <FightcoreCard.Header className="w-full">
            <div className="flex w-full flex-col justify-between gap-3 md:flex-row">
              <div className="flex-1">
                <Select
                  aria-label="Attacker"
                  className="w-full"
                  variant="secondary"
                  defaultSelectedKey={initialCharacter?.fightCoreId.toString()}
                  onSelectionChange={onAttackerChange}
                >
                  <Label>Attacker</Label>
                  <Select.Trigger>
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>{characterList}</ListBox>
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
                  onSelectionChange={onTargetChange}
                >
                  <Label>Target</Label>
                  <Select.Trigger>
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>{characterList}</ListBox>
                  </Select.Popover>
                </Select>
              </div>
            </div>
          </FightcoreCard.Header>
          <FightcoreCard.Body>
            <div className="flex flex-col justify-around justify-items-center gap-3 md:flex-row">
              <div className="">
                <div className="">Mode</div>
                <Tabs
                  aria-label="Calculator mode"
                  selectedKey={String(mode)}
                  onSelectionChange={(key) => setMode(Number.parseInt(String(key)) as Knockback)}
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
              <div className="">
                <div className="text-medium text-foreground-500 mb-1">Staleness</div>
                <StalenessQueue onStalenessChange={setStaleness} />
              </div>
              <div className="">
                <div className="mb-1 text-sm">Ceiling percentages</div>
                <Checkbox className="dark:text-white" isSelected={floorPercentages} onChange={setFlooringChange}>
                  <Checkbox.Control>
                    <Checkbox.Indicator />
                  </Checkbox.Control>
                  <Checkbox.Content>
                    <Label htmlFor="feature">Floored percentages</Label>
                    <Description>11.10% will display as 12%</Description>
                  </Checkbox.Content>
                </Checkbox>
              </div>
            </div>
          </FightcoreCard.Body>
        </FightcoreCard>
      </div>

      {characterData &&
        target &&
        CrouchCancelMoveList({
          target,
          character: characterData,
          floorPercentage: floorPercentages,
          knockbackTarget: mode,
          staleness,
        })}
    </>
  );
}
