import { Hitbox } from '@/models/hitbox';
import { Move } from '@/models/move';
import { MoveSummaryFormatter } from '@/utilities/move-summary-formatter';
import { getUnique } from '@/utilities/utils';

export interface MovePropertySummary {
  name: string;
  value: string;
  level?: 'warning';
  variant?: 'note' | 'knockback';
}

export function getMoveSummary(move: Move): MovePropertySummary[] {
  const formatter = new MoveSummaryFormatter();

  formatter.addIfNotNull('First Active', move.start);
  formatter.addIfNotNull('Last Active', move.end);
  formatter.addIfNotNull('Total', move.totalFrames, (value) => `${value} frames`);
  formatter.addIfNotNull('IASA', move.iasa);
  if (move.landLag && move.lCanceledLandLag) {
    formatter.addIfNotNull('Landing lag', `${move.landLag} (${move.lCanceledLandLag} L-Cancelled)`);
  } else {
    formatter.addIfNotNull('Landing lag', move.landLag);
  }
  formatter.addIfNotNull('Landing fall special lag', move.landingFallSpecialLag);

  let autoCancelText = '';
  if (move.autoCancelBefore) {
    autoCancelText += `<${move.autoCancelBefore} `;
  }
  if (move.autoCancelAfter) {
    autoCancelText += `${move.autoCancelAfter}> `;
  }
  formatter.addIfNotNull('Autocancel', autoCancelText);
  formatter.addIfNotNull('Notes', move.notes, undefined, undefined, 'note');

  if (move.isInterpolated) {
    formatter.addInterpolationWarning();
  }

  return formatter.Summary;
}

export function getHitboxesSummary(hitboxes: Hitbox[]): MovePropertySummary[] {
  const formatter = new MoveSummaryFormatter();

  formatter.addIfNotNull('Damage', getUniqueValues(hitboxes.map((hitbox) => hitbox.damage)), (value) => `${value}%`);
  formatter.addIfNotNull(
    'Base Knockback',
    getUniqueValues(hitboxes.map((hitbox) => hitbox.baseKnockback)),
    (value) => `${value}`,
  );
  formatter.addIfNotNull(
    'Knockback Growth',
    getUniqueValues(hitboxes.map((hitbox) => hitbox.knockbackGrowth)),
    (value) => `${value}`,
  );
  formatter.addIfNotNull(
    'Set Knockback',
    getUniqueValues(hitboxes.map((hitbox) => hitbox.setKnockback)),
    (value) => `${value}`,
  );
  formatter.addIfNotNull('Angle', getUniqueValues(hitboxes.map((hitbox) => hitbox.angle)), (value) => `${value}`);
  formatter.addIfNotNull('Effect', getUniqueValues(hitboxes.map((hitbox) => hitbox.effect)), (value) => `${value}`);

  return formatter.Summary;
}

export function getSmallMoveSummary(move: Move, hitboxes: Hitbox[]): MovePropertySummary[] {
  const includeEmpty = false;

  const formatter = new MoveSummaryFormatter(includeEmpty);
  formatter.addIfNotNull('First Active', move.start);
  formatter.addIfNotNull('Last Active', move.end);
  formatter.addIfNotNull('Total', move.totalFrames, (value) => `${value} frames`);
  formatter.addIfNotNull('Damage', getUniqueValues(hitboxes.map((hitbox) => hitbox.damage)), (value) => `${value}%`);
  formatter.addIfNotNull('IASA', move.iasa);
  if (move.landLag && move.lCanceledLandLag) {
    formatter.addIfNotNull('Landing lag', `${move.landLag} (${move.lCanceledLandLag} L-Cancelled)`);
  } else {
    formatter.addIfNotNull('Landing lag', move.landLag);
  }
  formatter.addIfNotNull('Landing fall special lag', move.landingFallSpecialLag);

  let autoCancelText = '';
  if (move.autoCancelBefore) {
    autoCancelText += `<${move.autoCancelBefore} `;
  }
  if (move.autoCancelAfter) {
    autoCancelText += `${move.autoCancelAfter}> `;
  }
  formatter.addIfNotNull('Autocancel', autoCancelText);
  formatter.addIfNotNull('Notes', move.notes, undefined, undefined, 'note');

  if (move.isInterpolated) {
    formatter.addInterpolationWarning();
  }
  return formatter.Summary;
}

function getUniqueValues(values: any[], formattingFunction?: (value: any) => string): string {
  const uniqueValues = getUnique(values);
  if (uniqueValues.length == 1) {
    if (formattingFunction) {
      return formattingFunction(uniqueValues[0]);
    }
    return uniqueValues[0];
  }

  if (formattingFunction) {
    return uniqueValues.map(formattingFunction).join(' / ');
  }
  return uniqueValues.join(' / ');
}
