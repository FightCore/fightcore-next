import { FlattenedHitbox } from "@/components/moves/hitboxes/hitbox-table-columns";
import { Hit } from "@/models/hit";
import { Hitbox } from "@/models/hitbox";
import { getMappedUnique } from "./utils";

export function areHitboxesOfHitEqual(hit: Hit): boolean {
  return areAllHitboxesEqual(hit.hitboxes);
}

export function areAllHitboxesEqual(hitboxes: Hitbox[]): boolean {
  if (hitboxes.length == 1) {
    return true;
  }

  const firstHitbox = hitboxes[0];

  return hitboxes
    .slice(1)
    .every((hitbox) => areHitboxesEqual(hitbox, firstHitbox));
}

export function areHitboxesEqual(
  hitboxOne: Hitbox,
  hitboxTwo: Hitbox
): boolean {
  const attributes: (keyof Hitbox)[] = [
    "angle",
    "damage",
    "baseKnockback",
    "knockbackGrowth",
    "setKnockback",
    "effect",
  ];

  for (const attribute of attributes) {
    if (hitboxOne[attribute] != hitboxTwo[attribute]) {
      return false;
    }
  }

  return true;
}

export function getHitboxColor(
  hits: HitboxColor[],
  frame: number
): string | null {
  const index = hits.findIndex((hit) => frame >= hit.start && frame <= hit.end);

  if (index == -1) {
    return null;
  }

  return hits[index].color;
}

export function processDuplicateHitboxes(hits: Hit[]): Hit[] {
  const newData = [];
  for (let hit of hits) {
    if (areAllHitboxesEqual(hit.hitboxes)) {
      const newHitbox = structuredClone(hit.hitboxes[0]);
      newHitbox.name = "All Hitboxes";
      const newHit = structuredClone(hit);
      newHit.hitboxes = [newHitbox];
      newData.push(newHit);
    } else {
      newData.push(hit);
    }
  }
  return newData;
}

export function processDuplicateHits(
  hits: FlattenedHitbox[]
): FlattenedHitbox[] {
  let newHits = structuredClone(hits);
  // Javascript moment. Gets the unique items in an array that I can then iterate over.
  let uniqueHitTexts = getMappedUnique(newHits, (hit) => hit.hit);
  for (let i = uniqueHitTexts.length - 1; i > 0; i--) {
    const firstHits = newHits.filter((hit) => hit.hit === uniqueHitTexts[i]);
    const secondHits = newHits.filter(
      (hit) => hit.hit === uniqueHitTexts[i - 1]
    );
    if (!firstHits || !secondHits) {
      return newHits;
    }

    if (areHitsEqual(firstHits, secondHits)) {
      const newText = secondHits[0].hit + ", " + firstHits[0].hit;
      for (const hit of [...secondHits]) {
        hit.hit = newText;
        hit.hitObjects.push(...firstHits[0].hitObjects);
      }
      const leadingIndex = newHits.indexOf(firstHits[0]);
      newHits.splice(leadingIndex, firstHits.length);
      uniqueHitTexts = getMappedUnique(newHits, (hit) => hit.hit);
    }
  }

  return newHits;
}

export function areHitsEqual(
  hitboxesOne: Hitbox[],
  hitboxesTwo: Hitbox[]
): boolean {
  if (hitboxesOne.length !== hitboxesTwo.length) {
    return false;
  }

  for (const hitboxOne of hitboxesOne) {
    const hitboxTwo = hitboxesTwo.find(
      (hitboxTwo) => hitboxTwo.name === hitboxOne.name
    );
    if (!hitboxTwo) {
      return false;
    }

    if (!areHitboxesEqual(hitboxOne, hitboxTwo)) {
      return false;
    }
  }

  return true;
}

export interface HitboxColor {
  start: number;
  end: number;
  color: string;
}

const colors = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-black dark:bg-white",
  "bg-pink-500",
  "bg-green-700",
  "bg-blue-300",
  "bg-blue-700",
  "bg-amber-500",
  "bg-lime-500",
];

export function generateColors(data: FlattenedHitbox[]): HitboxColor[] {
  const result: HitboxColor[] = [];
  const uniqueTexts = getMappedUnique(data, (hitbox) => hitbox.hit);
  let iterator = 0;
  for (const text of uniqueTexts) {
    const firstHitbox = data.find((hitbox) => hitbox.hit === text);
    if (!firstHitbox) {
      continue;
    }
    for (const hit of firstHitbox.hitObjects) {
      result.push({
        start: hit.start,
        end: hit.end,
        color: colors[iterator],
      });
    }
    iterator++;
  }

  return result;
}
