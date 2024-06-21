import { Character, CharacterBase } from "@/models/character";
import { Hitbox } from "@/models/hitbox";

export function isCrouchCancelPossible(hitbox: Hitbox): boolean {
  if ((hitbox.angle > 179 && hitbox.angle != 361) || hitbox.angle === 0) {
    return false;
  }
  return true;
}

export function getCrouchCancelImpossibleReason(hitbox: Hitbox): string {
  if (hitbox.angle > 179 && hitbox.angle != 361) {
    return `Can not be crouch canceled or ASDI downed-ed due to angle being higher than 179 (${hitbox.angle})`;
  }
  return `Can not be crouch canceled or ASDI down-ed due to angle being 0`;
}

export function calculateCrouchCancelPercentage(
  hitbox: Hitbox,
  target: CharacterBase,
  knockbackTarget: number
): string {
  const percentage =
    ((100 + target.characterStatistics.weight) / 14) *
      (((100 / hitbox.knockbackGrowth) *
        (knockbackTarget - hitbox.baseKnockback) -
        18) /
        (hitbox.damage + 2)) -
    hitbox.damage;
  if (percentage > 0) {
    return percentage.toFixed(2) + "%";
  }

  return "Impossible";
}
