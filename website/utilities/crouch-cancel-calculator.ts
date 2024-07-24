import { CharacterBase } from "@/models/character";
import { Hitbox } from "@/models/hitbox";
import { Move } from "@/models/move";
import { MoveType } from "@/models/move-type";

export function canBeCrouchCanceled(move: Move): boolean {
  const allowedTypes = [
    MoveType.air,
    MoveType.grounded,
    MoveType.special,
    MoveType.tilt,
    MoveType.unknown,
  ];
  return (
    allowedTypes.includes(move.type) && !!move.hits && move.hits.length > 0
  );
}

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
  knockbackTarget: number,
  floor: boolean
): string {
  if (hitbox.setKnockback) {
    return setKnockbackCalculation(hitbox, target, knockbackTarget);
  }

  const percentage =
    ((100 + target.characterStatistics.weight) / 14) *
      (((100 / hitbox.knockbackGrowth) *
        (knockbackTarget - hitbox.baseKnockback) -
        18) /
        (hitbox.damage + 2)) -
    hitbox.damage;
  if (percentage > 0) {
    if (floor) {
      return Math.floor(percentage) + "%";
    }

    return percentage.toFixed(2) + "%";
  }

  return "0%";
}

export function meetsKnockbackTarget(
  hitbox: Hitbox,
  character: CharacterBase,
  knockbackTarget: number
): boolean {
  // Weight dependant set knockback formula as found on the following sources:
  // eslint-disable-next-line max-len
  // - IKneeData: https://github.com/schmooblidon/schmooblidon.github.io/blob/09c8d4303ce6d98d62918073b474099b5ed9a026/calculatormaths.js#L101
  // - standardtoaster/magus on Smashboards: https://smashboards.com/threads/melee-knockback-values.334245/post-15368915
  const knockback =
    (((hitbox.setKnockback * 10) / 20 + 1) *
      1.4 *
      (200 / (character.characterStatistics.weight + 100)) +
      18) *
      (hitbox.knockbackGrowth / 100) +
    hitbox.baseKnockback;

  // The move can be CCed/ASDIed by the given character if the knockback target is NOT met.
  return knockback >= knockbackTarget;
}

function setKnockbackCalculation(
  hitbox: Hitbox,
  target: CharacterBase,
  knockbackTarget: number
): string {
  if (meetsKnockbackTarget(hitbox, target, knockbackTarget)) {
    return "Can never";
  } else {
    return "Will always";
  }
}
