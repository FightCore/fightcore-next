import { Hitbox } from "@/models/hitbox";
import { characters } from "@/config/framedata/framedata";
import { Tabs, Tab } from "@nextui-org/tabs";
import { Image } from "@nextui-org/image";
import { Card, CardHeader, CardBody } from "@nextui-org/card";
import {
  calculateCrouchCancelPercentage,
  getCrouchCancelImpossibleReason,
  isCrouchCancelPossible,
} from "@/utilities/crouch-cancel-calculator";
import { CharacterBase } from "@/models/character";
import { Radio, RadioGroup } from "@nextui-org/radio";
import React, { useEffect } from "react";
import { LOCAL_STORAGE_PREFERRED_CC_FLOOR, LOCAL_STORAGE_PREFERRED_CC_SORT } from "@/keys/local-storage-keys";
import { Checkbox } from "@nextui-org/checkbox";
import { Tooltip } from "@nextui-org/tooltip";
import { FaCircleQuestion } from "react-icons/fa6";

export interface CrouchCancelTableParams {
  hitboxes: Hitbox[];
}

export enum CrouchCancelSort {
  ALPHABETICAL = "alphabetical",
  WEIGHT = "weight",
}

export function CrouchCancelTable(params: Readonly<CrouchCancelTableParams>) {
  const [selected, setSelected] = React.useState(CrouchCancelSort.ALPHABETICAL);
  const [floorPercentages, setFloorPercentages] = React.useState(true);
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

  useEffect(() => {
    const localCharacters = structuredClone(characters)
      .filter((character) => character.characterStatistics.weight > 0)
      .sort((a, b) => sortCharacters(a, b, selected));
    setSortedCharacters(localCharacters);
  }, [selected]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const sort =
        (localStorage.getItem(LOCAL_STORAGE_PREFERRED_CC_SORT) as CrouchCancelSort) ?? CrouchCancelSort.ALPHABETICAL;
      setSelected(sort);

      const flooredText = localStorage.getItem(LOCAL_STORAGE_PREFERRED_CC_FLOOR);
      // If the flooring value wasn't set before, use true to prevent confusion.
      if (flooredText === null) {
        setFlooringChange(true);
      }

      const floor = !!flooredText;
      setFloorPercentages(floor);
    }
  }, [selected]);

  return (
    <>
      <div className="border border-gray-700 rounded-md p-2 grid grid-cols-1 md:grid-cols-2 mb-2">
        <RadioGroup label="Sorting" orientation="horizontal" value={selected} onValueChange={setSelection}>
          <Radio value={CrouchCancelSort.ALPHABETICAL}>Alphametical</Radio>
          <Radio value={CrouchCancelSort.WEIGHT}>Weight</Radio>
        </RadioGroup>

        <Checkbox isSelected={floorPercentages} onValueChange={setFlooringChange}>
          <div className="text-medium font-bold">Floor percentages</div>
          <div className="text-small">
            Melee uses floored percentages for its calculations, un-floored percentages can be viewed but should not be
            used.
          </div>
        </Checkbox>
      </div>

      <Tabs aria-label="Crouch Cancel and ASDI Tabs" disableAnimation>
        {params.hitboxes.map((hitbox) => {
          if (isCrouchCancelPossible(hitbox)) {
            return (
              <Tab key={hitbox.id} title={hitbox.name} className="md:flex">
                {GenerateCard(80, "ASDI Down", hitbox, sortedCharacters, floorPercentages)}
                {GenerateCard(120, "Crouch Cancel", hitbox, sortedCharacters, floorPercentages)}
              </Tab>
            );
          }
          return generateUnableToCCTab(hitbox);
        })}
      </Tabs>
    </>
  );
}

function GenerateCard(
  knockbackTarget: number,
  title: string,
  hitbox: Hitbox,
  sortedCharacters: CharacterBase[],
  floorPercentages: boolean
) {
  return (
    <div className="w-full md:w-1/2 p-2">
      <Card className="dark:bg-gray-800">
        <CardHeader>{title}</CardHeader>
        <CardBody>
          <div className="grid md:grid-cols-5 grid-cols-3">
            {sortedCharacters.map((character) => {
              let percentage = calculateCrouchCancelPercentage(hitbox, character, knockbackTarget, floorPercentages);
              return (
                <div key={knockbackTarget + character.fightCoreId}>
                  <Image alt={character.name} width={40} height={40} src={"/newicons/" + character.name + ".webp"} />
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

function sortCharacters(characterA: CharacterBase, characterB: CharacterBase, sort: CrouchCancelSort): number {
  if (sort === CrouchCancelSort.WEIGHT) {
    return characterA.characterStatistics.weight < characterB.characterStatistics.weight ? 1 : -1;
  }

  return characterA.name > characterB.name ? 1 : -1;
}
