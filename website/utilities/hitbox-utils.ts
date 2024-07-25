import { Hit } from "@/models/hit";
import { Hitbox } from "@/models/hitbox";

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
