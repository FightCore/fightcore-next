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
import { Alert } from '@heroui/alert';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Checkbox } from '@heroui/checkbox';
import { Image } from '@heroui/image';
import { Radio, RadioGroup } from '@heroui/radio';
import { Tab, Tabs } from '@heroui/tabs';
import { Tooltip } from '@heroui/tooltip';
import React, { useEffect } from 'react';
import { FaCircleExclamation } from 'react-icons/fa6';

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
        <CardHeader>
          <div className="flex flex-col">
            <div className="text-md">{title}</div>
            <div className="text-small text-default-500">{knockbackTarget} units of knockback</div>
          </div>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-3 gap-1 md:grid-cols-5">
            {sortedCharacters.map((character) => {
              const percentage = calculateCrouchCancelPercentage(
                hitbox,
                character,
                knockbackTarget,
                floorPercentages,
                use99Percent,
                // Staleness is not included in the table
                0,
              );
              const imagePart = <Image
                alt={character.name}
                width={30}
                height={30}
                src={'/newicons/' + character.name + '.webp'}
                className="mr-2 inline-block"
                removeWrapper={true}
              />
              const percentagePart = <span className="inline">{percentage}</span>
              const yoshiDjaInfoPart = knockbackTarget == 120 && character.name == "Yoshi" ? <Tooltip content="Same threshold for breaking Yoshi's DJA!" delay={250}><FaCircleExclamation /></Tooltip> : <></>
              return (
                <div key={knockbackTarget + character.fightCoreId}>
                  {imagePart}{percentagePart}{yoshiDjaInfoPart}
                </div>
              );
            })}
          </div>
        </CardBody>
      </Card>
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
      <div className="mb-2 grid grid-cols-1 gap-2 rounded-md border border-gray-700 p-2 md:grid-cols-3">
        <div className="px-1 pb-2">
          <div className="text-medium font-bold">Sorting</div>
          <RadioGroup orientation="horizontal" value={selected} onValueChange={setSelection}>
            <Radio value={CrouchCancelSort.ALPHABETICAL}>Alphametical</Radio>
            <Radio value={CrouchCancelSort.WEIGHT}>Weight</Radio>
          </RadioGroup>
        </div>

        <Checkbox isSelected={floorPercentages} onValueChange={setFlooringChange}>
          <div className="text-medium font-bold">Ceiling percentages</div>
          <div className="text-small">
            Melee uses floored percentages for its calculations, if a move breaks at 11.10%, it means it breaks at 12%.
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
                return (
                  <Tab key={hitbox.id} title={hitbox.name} className="md:flex md:flex-wrap">
                    {!isCrouchCancelPossible(hitbox) && (
                      <Alert
                        color={'warning'}
                        title={getCrouchCancelImpossibleReason(hitbox)}
                        description={"This hitbox does not send upwards, and thus it will put the opponent into their grounded flinch state before it knocks down"}
                      />
                    )}
                    {hitbox.hitlagDefender > 10 && (
                      <Alert
                        color={'warning'}
                        title={`This move has more than 10 frames of hitlag ${hitbox.hitlagDefenderCrouched > 10 ? "(even when CC'd)" : ""}, making it difficult/sometimes impossible to ASDI down`}
                        description={"When a character is airborne for more than 10 frames, their ECB lock expires. This pulls up their ECB, creating distance between them and the ground, which makes ASDI Down break earlier/require specific SDI inputs first"}
                      />
                    )}
                    {(hit.id >= 2646 && hit.id <= 2650) && (
                      <Alert
                        color={'warning'}
                        title={`Do NOT ASDI-Down/CC Peach Downsmash.`}
                        description={"You have been warned."}
                      />
                    )}
                    {generateCard(
                      80,
                      "ASDI Down",
                      hitbox,
                      sortedCharacters,
                      floorPercentages,
                      numericalPercentage,
                    )}
                    {generateCard(
                      120,
                      "Crouch-Cancel",
                      hitbox,
                      sortedCharacters,
                      floorPercentages,
                      numericalPercentage,
                    )}
                  </Tab>
                );
              })}
            </Tabs>
          </Tab>
        ))}
      </Tabs>
    </>
  );
}
