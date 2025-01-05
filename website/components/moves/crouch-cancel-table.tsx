import { characters } from '@/config/framedata/framedata';
import {
  LOCAL_STORAGE_PREFERRED_CC_FLOOR,
  LOCAL_STORAGE_PREFERRED_CC_NUMERIC_MAX,
  LOCAL_STORAGE_PREFERRED_CC_SORT,
} from '@/keys/local-storage-keys';
import { CharacterBase } from '@/models/character';
import { Hit } from '@/models/hit';
import { Hitbox } from '@/models/hitbox';
import {
  calculateCrouchCancelPercentage,
  getCrouchCancelImpossibleReason,
  isCrouchCancelPossible,
} from '@/utilities/crouch-cancel-calculator';
import { areAllHitboxesEqual, areHitboxesEqual } from '@/utilities/hitbox-utils';
import { Card, CardBody, CardHeader } from '@nextui-org/card';
import { Checkbox } from '@nextui-org/checkbox';
import { Image } from '@nextui-org/image';
import { Radio, RadioGroup } from '@nextui-org/radio';
import { Tab, Tabs } from '@nextui-org/tabs';
import React, { useEffect } from 'react';

export interface CrouchCancelTableParams {
  hits: Hit[];
}

export enum CrouchCancelSort {
  ALPHABETICAL = 'alphabetical',
  WEIGHT = 'weight',
}

function generateCard(
  knockbackTarget: number,
  title: string,
  hitbox: Hitbox,
  sortedCharacters: CharacterBase[],
  floorPercentages: boolean,
  use99Percent: boolean,
) {
  return (
    <div className="w-full p-2 md:w-1/2">
      <Card className="dark:bg-gray-800">
        <CardHeader>{title}</CardHeader>
        <CardBody>
          <div className="grid grid-cols-3 md:grid-cols-5">
            {sortedCharacters.map((character) => {
              const percentage = calculateCrouchCancelPercentage(
                hitbox,
                character,
                knockbackTarget,
                floorPercentages,
                use99Percent,
              );
              return (
                <div key={knockbackTarget + character.fightCoreId}>
                  <Image alt={character.name} width={40} height={40} src={'/newicons/' + character.name + '.webp'} />
                  <span className="d-inline">{percentage}</span>
                </div>
              );
            })}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

function generateUnableToCCTab(hitbox: Hitbox) {
  return (
    <Tab key={hitbox.id} title={hitbox.name} className="md:flex">
      <Card className="dark:bg-gray-800">
        <CardBody>{getCrouchCancelImpossibleReason(hitbox)}</CardBody>
      </Card>
    </Tab>
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
      const newHitbox = structuredClone(hit.hitboxes[0]);
      newHitbox.name = 'All Hitboxes';
      const newHit = structuredClone(hit);
      newHit.hitboxes = [newHitbox];
      newHits.push(newHit);
    } else {
      newHits.push(structuredClone(hit));
    }
  }

  // Merge hits together if the hitboxes are the same
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
    const localCharacters = structuredClone(characters)
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
      <div className="mb-2 grid grid-cols-1 rounded-md border border-gray-700 p-2 md:grid-cols-3">
        <div className="px-1 pb-2">
          <div className="text-medium font-bold">Sorting</div>
          <RadioGroup orientation="horizontal" value={selected} onValueChange={setSelection}>
            <Radio value={CrouchCancelSort.ALPHABETICAL}>Alphametical</Radio>
            <Radio value={CrouchCancelSort.WEIGHT}>Weight</Radio>
          </RadioGroup>
        </div>

        <Checkbox isSelected={floorPercentages} onValueChange={setFlooringChange}>
          <div className="text-medium font-bold">Floor percentages</div>
          <div className="text-small">
            Melee uses floored percentages for its calculations, un-floored percentages can be viewed but should not be
            used.
          </div>
        </Checkbox>

        <Checkbox isSelected={numericalPercentage} onValueChange={setNumericalChange}>
          <div className="text-medium font-bold">Use 99% for moves that never break</div>
          <div className="text-small">
            Some moves can never break crouch cancel/ASDI Down, note these moves as &quot;99%&quot; rather than
            &quot;Never breaks&quot;
          </div>
        </Checkbox>
      </div>

      <Tabs
        aria-label="Crouch Cancel and ASDI Tabs"
        disableAnimation
        placement="top"
        className="w-max max-w-full overflow-x-scroll"
      >
        {data.map((hit) => (
          <Tab key={hit.id} title={hitName(hit)}>
            <Tabs
              aria-label="Crouch Cancel and ASDI Tabs"
              disableAnimation
              className="mb-2 grid grid-cols-1 md:grid-cols-2"
            >
              {hit.hitboxes.map((hitbox) => {
                if (isCrouchCancelPossible(hitbox)) {
                  return (
                    <Tab key={hitbox.id} title={hitbox.name} className="md:flex">
                      {generateCard(80, 'ASDI Down', hitbox, sortedCharacters, floorPercentages, numericalPercentage)}
                      {generateCard(
                        120,
                        'Crouch Cancel',
                        hitbox,
                        sortedCharacters,
                        floorPercentages,
                        numericalPercentage,
                      )}
                    </Tab>
                  );
                }
                return generateUnableToCCTab(hitbox);
              })}
            </Tabs>
          </Tab>
        ))}
      </Tabs>
    </>
  );
}
