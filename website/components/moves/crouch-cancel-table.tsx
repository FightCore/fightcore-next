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

export interface CrouchCancelTableParams {
  hitboxes: Hitbox[];
}

export enum CrouchCancelSort {
  ALPHABETICAL = "alphabetical",
  WEIGHT = "weight",
}

export function CrouchCancelTable(params: Readonly<CrouchCancelTableParams>) {
  const [selected, setSelected] = React.useState(CrouchCancelSort.ALPHABETICAL);
  const localCharacters = characters
    .filter((character) => character.characterStatistics.weight > 0)
    .sort((a, b) => sortCharacters(a, b, selected));
  const [sortedCharacters, setSortedCharacters] = React.useState(localCharacters);

  const setSelection = (value: string) => {
    setSelected(value as CrouchCancelSort);
  };

  useEffect(() => {
    const localCharacters = structuredClone(characters)
      .filter((character) => character.characterStatistics.weight > 0)
      .sort((a, b) => sortCharacters(a, b, selected));
    setSortedCharacters(localCharacters);
  }, [selected]);

  return (
    <>
      <RadioGroup label="Sorting" orientation="horizontal" value={selected} onValueChange={setSelection}>
        <Radio value={CrouchCancelSort.ALPHABETICAL}>Alphametical</Radio>
        <Radio value={CrouchCancelSort.WEIGHT}>Weight</Radio>
      </RadioGroup>
      <Tabs aria-label="Crouch Cancel and ASDI Tabs" disableAnimation>
        {params.hitboxes.map((hitbox) => {
          if (isCrouchCancelPossible(hitbox)) {
            return (
              <Tab key={hitbox.id} title={hitbox.name} className="md:flex">
                {GenerateCard(80, "ASDI Down", hitbox, sortedCharacters)}
                {GenerateCard(120, "Crouch Cancel", hitbox, sortedCharacters)}
              </Tab>
            );
          }
          return generateUnableToCCTab(hitbox);
        })}
      </Tabs>
    </>
  );
}

function GenerateCard(knockbackTarget: number, title: string, hitbox: Hitbox, sortedCharacters: CharacterBase[]) {
  return (
    <div className="w-full md:w-1/2 p-2">
      <Card className="dark:bg-gray-800">
        <CardHeader>{title}</CardHeader>
        <CardBody>
          <div className="grid md:grid-cols-5 grid-cols-3">
            {sortedCharacters.map((character) => (
              <div key={knockbackTarget + character.fightCoreId}>
                <Image alt={character.name} width={40} height={40} src={"/newicons/" + character.name + ".webp"} />
                <span className="d-inline">{calculateCrouchCancelPercentage(hitbox, character, knockbackTarget)}</span>
              </div>
            ))}
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
