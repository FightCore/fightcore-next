import { Move } from '@/models/move';
import { getUnique } from '@/utilities/utils';

export interface MovePropertySummary {
  name: string;
  value: string;
  level?: 'warning';
  variant?: 'note';
}

export function getMoveSummary(move: Move): MovePropertySummary[] {
  const summary: MovePropertySummary[] = [];

  const addIfNotNull = (
    name: string,
    value: string | number | null | undefined,
    formatter?: (value: string | number) => string,
    level?: 'warning',
    variant?: 'note',
  ) => {
    if (value != null && value !== '' && value !== undefined) {
      if (formatter) {
        summary.push({ name, value: formatter(value), level, variant });
      } else {
        summary.push({ name, value: value.toString(), level, variant });
      }
    }
  };

  // Standard properties section
  addIfNotNull('First Active', move.start);
  addIfNotNull('Last Active', move.end);
  addIfNotNull('Total', move.totalFrames, (value) => `${value} frames`);
  //addIfNotNull('IASA', move.iasa);
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

  // Calculated properties section
  const damageValues = move.hits?.flatMap((hit) => hit.hitboxes.flatMap((hitbox) => hitbox.damage));
  if (damageValues) {
    const damages = getUnique(damageValues);
    if (damages.length == 1) {
      addIfNotNull('Damage', damages[0], (value) => `${value}%`);
    } else {
      const damageValueDisplay = damages.map((damage) => `${damage}%`).join('/');
      addIfNotNull('Damage', damageValueDisplay);
    }
  }

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
