import { characters } from '@/config/framedata/framedata';
import {
  LOCAL_STORAGE_PREFERRED_CC_FLOOR,
  LOCAL_STORAGE_PREFERRED_CC_NUMERIC_MAX,
  LOCAL_STORAGE_PREFERRED_CC_SORT,
} from '@/keys/local-storage-keys';
import { CharacterBase } from '@/models/character';
import { Hit } from '@/models/hit';
import { Hitbox } from '@/models/hitbox';
import { cloneObject } from '@/utilities/clone';
import {
  calculateCrouchCancelPercentage,
  getCrouchCancelImpossibleReason,
  isCrouchCancelPossible,
} from '@/utilities/crouch-cancel-calculator';
import { areAllHitboxesEqual, areHitboxesEqual } from '@/utilities/hitbox-utils';
import { Alert, Card, Checkbox, Label, Radio, RadioGroup, Tabs, Tooltip } from '@heroui/react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { FaCircleExclamation } from 'react-icons/fa6';
import StalenessQueue from './crouch-cancel/staleness-queue';

export interface CrouchCancelTableParams {
  hits: Hit[];
}

export enum CrouchCancelSort {
  ALPHABETICAL = 'alphabetical',
  WEIGHT = 'weight',
}

function GenerateCard({
  knockbackTarget,
  title,
  hitbox,
  sortedCharacters,
  floorPercentages,
  use999Percent,
  staleness,
}: {
  knockbackTarget: number;
  title: string;
  hitbox: Hitbox;
  sortedCharacters: CharacterBase[];
  floorPercentages: boolean;
  use999Percent: boolean;
  staleness: number;
}) {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  return (
    <div className="w-full p-2 md:w-1/2">
      <Card.Root>
        <Card.Header>
          <div className="flex flex-col">
            <div className="text-md">{title}</div>
            <div className="text-small text-default-500">{knockbackTarget} units of knockback</div>
          </div>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-3 gap-1 md:grid-cols-5">
            {sortedCharacters.map((character) => {
              const percentage = calculateCrouchCancelPercentage(
                hitbox,
                character,
                knockbackTarget,
                floorPercentages,
                use999Percent,
                staleness,
              );
              const imagePart = (
                <Image
                  alt={character.name}
                  width={30}
                  height={30}
                  src={'/newicons/' + character.name + '.webp'}
                  className="mr-2 inline-block"
                />
              );
              const percentagePart = <span className="inline">{percentage}</span>;
              const yoshiDjaInfoPart =
                knockbackTarget == 120 && character.name == 'Yoshi' ? (
                  <div className="absolute">
                    <Tooltip isOpen={isTooltipOpen} onOpenChange={(open) => setIsTooltipOpen(open)} delay={250}>
                      <Tooltip.Trigger>
                        <FaCircleExclamation onClick={() => setIsTooltipOpen(true)} />
                      </Tooltip.Trigger>
                      <Tooltip.Content>Same threshold for breaking Yoshi&apos;s DJA!</Tooltip.Content>
                    </Tooltip>
                  </div>
                ) : (
                  <></>
                );
              return (
                <div key={knockbackTarget + character.fightCoreId}>
                  {imagePart}
                  {percentagePart}
                  {yoshiDjaInfoPart}
                </div>
              );
            })}
          </div>
        </Card.Content>
      </Card.Root>
    </div>
  );
}

function hitName(hit: Hit): string {
  if (hit.name) {
    return hit.name;
  }

  return `${hit.start} - ${hit.end}`;
}

function sortCharacters(characterA: CharacterBase, characterB: CharacterBase, sort: CrouchCancelSort): number {
  if (sort === CrouchCancelSort.WEIGHT) {
    return characterA.characterStatistics.weight < characterB.characterStatistics.weight ? 1 : -1;
  }

  return characterA.name > characterB.name ? 1 : -1;
}

function preprocessHits(hits: Hit[]): Hit[] {
  const newHits: Hit[] = [];
  for (const hit of hits) {
    if (areAllHitboxesEqual(hit.hitboxes)) {
      const newHitbox = cloneObject(hit.hitboxes[0]);
      newHitbox.name = 'All Hitboxes';
      const newHit = cloneObject(hit);
      newHit.hitboxes = [newHitbox];
      newHits.push(newHit);
    } else {
      newHits.push(cloneObject(hit));
    }
  }

  for (let i = 0; i < newHits.length; i++) {
    for (let j = i + 1; j < newHits.length; j++) {
      const areAllHitboxesEqual = newHits[i].hitboxes.every((hitA) => {
        const correspondingHitbox = newHits[j].hitboxes.find((hitboxTwo) => hitboxTwo.name === hitA.name);
        return correspondingHitbox && areHitboxesEqual(hitA, correspondingHitbox);
      });

      if (areAllHitboxesEqual) {
        newHits[i].end = newHits[j].end;
        newHits[i].name = `Hits ${newHits[i].start} - ${newHits[i].end}`;
        newHits.splice(j, 1);
        j--;
      }
    }
  }

  if (hits.length !== 1 && newHits.length === 1) {
    newHits[0].name = 'All hits';
  }

  return newHits;
}

export function CrouchCancelTable(params: Readonly<CrouchCancelTableParams>) {
  const data = preprocessHits(params.hits);
  const [selected, setSelected] = React.useState(CrouchCancelSort.ALPHABETICAL);
  const [floorPercentages, setFloorPercentages] = React.useState(true);
  const [numericalPercentage, setNumericalBreak] = React.useState(false);
  const [staleness, setStaleness] = React.useState(0);
  const localCharacters = characters
    .filter((character) => character.characterStatistics.weight > 0)
    .sort((a, b) => sortCharacters(a, b, selected));
  const [sortedCharacters, setSortedCharacters] = React.useState(localCharacters);

  const setSelection = (value: string) => {
    setSelected(value as CrouchCancelSort);
    localStorage.setItem(LOCAL_STORAGE_PREFERRED_CC_SORT, value);
  };

  const setFlooringChange = (value: boolean) => {
    setFloorPercentages(value);
    localStorage.setItem(LOCAL_STORAGE_PREFERRED_CC_FLOOR, String(value));
  };

  const setNumericalChange = (value: boolean) => {
    setNumericalBreak(value);
    localStorage.setItem(LOCAL_STORAGE_PREFERRED_CC_NUMERIC_MAX, String(value));
  };

  useEffect(() => {
    const localCharacters = cloneObject(characters)
      .filter((character) => character.characterStatistics.weight > 0)
      .sort((a, b) => sortCharacters(a, b, selected));
    setSortedCharacters(localCharacters);
  }, [selected]);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const sort =
        (localStorage.getItem(LOCAL_STORAGE_PREFERRED_CC_SORT) as CrouchCancelSort) ?? CrouchCancelSort.ALPHABETICAL;
      setSelected(sort);

      const flooredText = localStorage.getItem(LOCAL_STORAGE_PREFERRED_CC_FLOOR);
      // If the flooring value wasn't set before, use true to prevent confusion.
      if (flooredText === null) {
        setFlooringChange(true);
      } else {
        const floor = !!flooredText;
        setFloorPercentages(floor);
      }

      const numericBreakText = localStorage.getItem(LOCAL_STORAGE_PREFERRED_CC_NUMERIC_MAX);
      if (numericBreakText === null) {
        setNumericalChange(false);
      } else {
        const numericBreak = !!numericBreakText;
        setNumericalBreak(numericBreak);
      }
    }
  }, [selected]);

  return (
    <>
      <div className="border-default-200 mb-2 grid grid-cols-1 gap-4 rounded-md border p-4 md:grid-cols-3">
        <div className="flex flex-col gap-2">
          <Label>Sorting</Label>
          <RadioGroup
            value={selected}
            onChange={setSelection}
            aria-label="Sort order"
            orientation="horizontal"
            className="flex gap-3"
          >
            <Radio value={CrouchCancelSort.ALPHABETICAL}>
              <Radio.Control>
                <Radio.Indicator />
              </Radio.Control>
              <Radio.Content>Alphabetical</Radio.Content>
            </Radio>
            <Radio value={CrouchCancelSort.WEIGHT}>
              <Radio.Control>
                <Radio.Indicator />
              </Radio.Control>
              <Radio.Content>Weight</Radio.Content>
            </Radio>
          </RadioGroup>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Display</Label>
          <Tooltip delay={0}>
            <Tooltip.Trigger>
              <Checkbox className="dark:text-white" isSelected={floorPercentages} onChange={setFlooringChange}>
                <Checkbox.Control>
                  <Checkbox.Indicator />
                </Checkbox.Control>
                <Checkbox.Content>Ceiling percentages</Checkbox.Content>
              </Checkbox>
            </Tooltip.Trigger>
            <Tooltip.Content>
              Melee uses floored percentages for its calculations. If a move breaks at 11.10%, enabling this will
              display it as breaking at 12%.
            </Tooltip.Content>
          </Tooltip>
          <Tooltip>
            <Tooltip.Trigger>
              <Checkbox className="dark:text-white" isSelected={numericalPercentage} onChange={setNumericalChange}>
                <Checkbox.Control>
                  <Checkbox.Indicator />
                </Checkbox.Control>
                <Checkbox.Content>Use 999% for moves that never break</Checkbox.Content>
              </Checkbox>
            </Tooltip.Trigger>
            <Tooltip.Content>
              Some moves can never break crouch cancel/ASDI Down, note these moves as &quot;999%&quot; rather than
              &quot;Never breaks&quot;
            </Tooltip.Content>
          </Tooltip>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Staleness</Label>
          <StalenessQueue onStalenessChange={setStaleness} />
        </div>
      </div>

      <Tabs aria-label="Crouch Cancel and ASDI Tabs" className="w-full max-w-full overflow-x-scroll">
        <Tabs.ListContainer>
          <Tabs.List>
            {data.map((hit) => (
              <Tabs.Tab key={hit.id} id={String(hit.id)}>
                {hitName(hit)}
                <Tabs.Indicator />
              </Tabs.Tab>
            ))}
          </Tabs.List>
        </Tabs.ListContainer>
        {data.map((hit) => (
          <Tabs.Panel key={hit.id} id={String(hit.id)}>
            <Tabs aria-label="Hitbox Tabs">
              <Tabs.ListContainer>
                <Tabs.List>
                  {hit.hitboxes.map((hitbox) => (
                    <Tabs.Tab key={hitbox.id} id={String(hitbox.id)}>
                      {hitbox.name}
                      <Tabs.Indicator />
                    </Tabs.Tab>
                  ))}
                </Tabs.List>
              </Tabs.ListContainer>
              <div className="mb-2 w-full">
                {hit.hitboxes.map((hitbox) => (
                  <Tabs.Panel key={hitbox.id} id={String(hitbox.id)} className="w-full md:flex md:flex-wrap">
                    {!isCrouchCancelPossible(hitbox) && (
                      <Alert status="warning">
                        <Alert.Content>
                          <Alert.Title>{getCrouchCancelImpossibleReason(hitbox)}</Alert.Title>
                          <Alert.Description>
                            This hitbox does not send upwards, so it will put the opponent into their grounded flinch
                            state before it would knock them down
                          </Alert.Description>
                        </Alert.Content>
                      </Alert>
                    )}
                    {hitbox.hitlagDefender > 10 && (
                      <Alert status="warning">
                        <Alert.Content>
                          <Alert.Title>{`This move has more than 10 frames of hitlag ${hitbox.hitlagDefenderCrouched > 10 ? "(even when CC'd)" : ''}, making it difficult or sometimes impossible to ASDI Down`}</Alert.Title>
                          <Alert.Description>
                            When a character is airborne for more than 10 frames, their ECB lock expires. This pulls up
                            their ECB, creating distance between them and the ground, which makes ASDI Down break
                            earlier or require specific SDI inputs first
                          </Alert.Description>
                        </Alert.Content>
                      </Alert>
                    )}
                    {hit.id >= 2646 && hit.id <= 2650 && (
                      <Alert status="warning">
                        <Alert.Content>
                          <Alert.Title>Do NOT ASDI Down/CC Peach Downsmash.</Alert.Title>
                          <Alert.Description>You have been warned.</Alert.Description>
                        </Alert.Content>
                      </Alert>
                    )}
                    {hitbox.angle == 361 && (
                      <Alert status="warning">
                        <Alert.Content>
                          <Alert.Title>This move sends at the Sakurai Angle (361 degrees).</Alert.Title>
                          <Alert.Description>
                            While grounded and below 32 units of knockback, this move sends at 0 degrees, and thus
                            cannot be ASDI Downed
                          </Alert.Description>
                        </Alert.Content>
                      </Alert>
                    )}
                    <GenerateCard
                      knockbackTarget={80}
                      title="ASDI Down"
                      hitbox={hitbox}
                      sortedCharacters={sortedCharacters}
                      floorPercentages={floorPercentages}
                      use999Percent={numericalPercentage}
                      staleness={staleness}
                    />
                    <GenerateCard
                      knockbackTarget={120}
                      title="Crouch-Cancel"
                      hitbox={hitbox}
                      sortedCharacters={sortedCharacters}
                      floorPercentages={floorPercentages}
                      use999Percent={numericalPercentage}
                      staleness={staleness}
                    />
                    {hitbox.angle == 361 && (
                      <GenerateCard
                        knockbackTarget={32}
                        title="Sakurai Angle starts being ASDI-Downable"
                        hitbox={hitbox}
                        sortedCharacters={sortedCharacters}
                        floorPercentages={floorPercentages}
                        use999Percent={numericalPercentage}
                        staleness={staleness}
                      />
                    )}
                    {hitbox.angle == 361 && (
                      <GenerateCard
                        knockbackTarget={48}
                        title="Sakurai Angle starts being Crouch-Cancellable"
                        hitbox={hitbox}
                        sortedCharacters={sortedCharacters}
                        floorPercentages={floorPercentages}
                        use999Percent={numericalPercentage}
                        staleness={staleness}
                      />
                    )}
                  </Tabs.Panel>
                ))}
              </div>
            </Tabs>
          </Tabs.Panel>
        ))}
      </Tabs>
    </>
  );
}
