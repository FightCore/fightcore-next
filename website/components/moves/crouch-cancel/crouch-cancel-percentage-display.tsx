import { CharacterBase } from '@/models/character';
import { Hitbox } from '@/models/hitbox';
import {
  calculateCrouchCancelPercentage,
  getCrouchCancelImpossibleReason,
  isCrouchCancelPossible,
} from '@/utilities/crouch-cancel-calculator';
import { useMemo } from 'react';

export interface CrouchCancelPercentageDisplayData {
  hitbox: Hitbox;
  target: CharacterBase;
  knockbackTarget: number;
  floor: boolean;
  staleness: number;
}

export default function CrouchCancelPercentageDisplay(params: Readonly<CrouchCancelPercentageDisplayData>) {
  function generateHitboxPercentage(
    hitbox: Hitbox,
    target: CharacterBase,
    knockbackTarget: number,
    floor: boolean,
    staleness: number,
  ) {
    if (!isCrouchCancelPossible(hitbox)) {
      return getCrouchCancelImpossibleReason(hitbox);
    }

    return calculateCrouchCancelPercentage(hitbox, target, knockbackTarget, floor, false, staleness);
  }

  const percentage = useMemo(
    () =>
      generateHitboxPercentage(params.hitbox, params.target, params.knockbackTarget, params.floor, params.staleness),
    [params.hitbox, params.target, params.knockbackTarget, params.floor, params.staleness],
  );

  return <>{percentage}</>;
}
