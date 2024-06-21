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

export interface CrouchCancelTableParams {
  hitboxes: Hitbox[];
  sort: CrouchCancelSort;
}

export enum CrouchCancelSort {
  alphabetical = 0,
  weight = 1,
}

export function CrouchCancelTable(params: Readonly<CrouchCancelTableParams>) {
  return (
    <Tabs aria-label="Dynamic tabs" items={params.hitboxes} disableAnimation>
      {(hitbox) => {
        if (isCrouchCancelPossible(hitbox)) {
          return (
            <Tab key={hitbox.id} title={hitbox.name} className="md:flex">
              {GenerateCard(80, "ASDI Down", hitbox, params.sort)}
              {GenerateCard(120, "Crouch Cancel", hitbox, params.sort)}
            </Tab>
          );
        }
        return generateUnableToCCTab(hitbox);
      }}
    </Tabs>
  );
}

function GenerateCard(knockbackTarget: number, title: string, hitbox: Hitbox, sort: CrouchCancelSort) {
  sort = 1;
  return (
    <div className="w-full md:w-1/2 p-2">
      <Card className="dark:bg-gray-800">
        <CardHeader>{title}</CardHeader>
        <CardBody>
          <div className="grid md:grid-cols-5 grid-cols-3">
            {characters
              .filter((character) => character.characterStatistics.weight > 0)
              .sort((a, b) => sortCharacters(a, b, sort))
              .map((character) => {
                return (
                  <div key={character.fightCoreId}>
                    <Image alt={character.name} width={40} height={40} src={"/newicons/" + character.name + ".webp"} />
                    <span className="d-inline">
                      {calculateCrouchCancelPercentage(hitbox, character, knockbackTarget)}
                    </span>
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
  if (sort === CrouchCancelSort.weight) {
    return characterA.characterStatistics.weight < characterB.characterStatistics.weight ? 1 : -1;
  }

  return characterA.name > characterB.name ? 1 : -1;
}
