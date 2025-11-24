import { Hitbox } from '@/models/hitbox';
import { Move } from '@/models/move';
import { getUnique } from '@/utilities/utils';

export interface MovePropertySummary {
  name: string;
  value: string;
  level?: 'warning';
  variant?: 'note' | 'knockback';
}

export function getMoveSummary(move: Move): MovePropertySummary[] {
  const summary: MovePropertySummary[] = [];

  const addIfNotNull = (
    name: string,
    value: string | number | null | undefined,
    formatter?: (value: string | number) => string,
    level?: 'warning',
    variant?: 'note' | 'knockback',
  ) => {
    if (value != null && value !== '' && value !== undefined && value !== 0) {
      if (formatter) {
        summary.push({ name, value: formatter(value), level, variant });
      } else {
        summary.push({ name, value: value.toString(), level, variant });
      }
    } else {
      summary.push({ name, value: '-', level, variant });
    }
  };

  // Standard properties section
  addIfNotNull('First Active', move.start);
  addIfNotNull('Last Active', move.end);
  addIfNotNull('Total', move.totalFrames, (value) => `${value} frames`);
  addIfNotNull('IASA', move.iasa);
  if (move.landLag && move.lCanceledLandLag) {
    addIfNotNull('Landing lag', `${move.landLag} (${move.lCanceledLandLag} L-Cancelled)`);
  } else {
    addIfNotNull('Landing lag', move.landLag);
  }

  let autoCancelText = '';
  if (move.autoCancelBefore) {
    autoCancelText += `<${move.autoCancelBefore} `;
  }
  if (move.autoCancelAfter) {
    autoCancelText += `${move.autoCancelAfter}> `;
  }
  addIfNotNull('Autocancel', autoCancelText);
  addIfNotNull('Notes', move.notes, undefined, undefined, 'note');
  addIfNotNull('Landing fall special lag', move.landingFallSpecialLag);

  if (move.isInterpolated) {
    summary.push({
      name: 'Interpolated',
      value:
        'Move is interpolated: This move is based off its grounded variant, the data has not been fact checked yet and may be incorrect.',
      level: 'warning',
      variant: 'note',
    });
  }

  return summary;
}

export function getHitboxesSummary(hitboxes: Hitbox[]): MovePropertySummary[] {
  const summary: MovePropertySummary[] = [];

  const addIfNotNull = (
    name: string,
    value: string | number | null | undefined,
    formatter?: (value: string | number) => string,
    level?: 'warning',
    variant?: 'note' | 'knockback',
  ) => {
    if (value != null && value !== '' && value !== undefined && value !== 0) {
      if (formatter) {
        summary.push({ name, value: formatter(value), level, variant });
      } else {
        summary.push({ name, value: value.toString(), level, variant });
      }
    } else {
      summary.push({ name, value: '-', level, variant });
    }
  };

  addIfNotNull('Damage', getUniqueValues(hitboxes.map((hitbox) => hitbox.damage)), (value) => `${value}%`);
  addIfNotNull(
    'Base Knockback',
    getUniqueValues(hitboxes.map((hitbox) => hitbox.baseKnockback)),
    (value) => `${value}`,
  );
  addIfNotNull(
    'Knockback Growth',
    getUniqueValues(hitboxes.map((hitbox) => hitbox.knockbackGrowth)),
    (value) => `${value}`,
  );
  addIfNotNull('Set Knockback', getUniqueValues(hitboxes.map((hitbox) => hitbox.setKnockback)), (value) => `${value}`);
  addIfNotNull('Angle', getUniqueValues(hitboxes.map((hitbox) => hitbox.angle)), (value) => `${value}`);
  addIfNotNull('Effect', getUniqueValues(hitboxes.map((hitbox) => hitbox.effect)), (value) => `${value}`);

  return summary;
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
