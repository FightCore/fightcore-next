import { CharacterBase } from '@/models/character';
import { Move } from '@/models/move';

export const metaConfig = {
  tags: [
    'Super Smash Bros. Melee',
    'Melee frame data',
    'hitbox data',
    'move stats',
    'Smash Bros',
    'SSBM',
    'FightCore',
    'frame data',
    'crouch cancel percentages',
    'asdi down percentages',
    'hitboxes',
    'damage',
    'visualizations',
    'hitlag',
    'hitstun',
    'shieldstun',
  ],
};

export function indexMetaDescription(): string {
  return (
    'FightCore.gg is the ultimate resource for Super Smash Bros. Melee frame data, hitboxes, and visualization.' +
    ' Explore detailed character animations with our interactive hitbox viewer and crouch cancel calculator.'
  );
}

export function characterMetaDescription(character: CharacterBase): string {
  return (
    `Explore ${character.name}\’s complete frame data in Super Smash Bros. Melee on FightCore.gg. ` +
    "Discover every move's properties and view the most detailed hitbox information available. " +
    'FightCore.gg is the ultimate resource for Melee frame data and hitbox analysis.'
  );
}

export function moveMetaDescription(character: CharacterBase, move: Move): string {
  const moveSummary = createMoveSummary(move);
  const siteDescription =
    `Break down ${character.name}\’s ${move.name} frame data in Super Smash Bros. Melee on FightCore.gg. ` +
    'Analyze its startup, active, and end frames, plus hitbox placement. ' +
    'See detailed animations and hitbox visualizations to understand its power and potential.';

  return `${moveSummary} | ${siteDescription}`;
}

export function crouchCancelMetaDescription(character: CharacterBase): string {
  return (
    `Calculate ${character.name}\’s crouch cancel effectiveness in Super Smash Bros. Melee ' ` +
    'with FightCore.gg\’s Crouch Cancel Calculator. ' +
    'See how much knockback reduction you get against different moves, analyze survivability, ' +
    'and optimize counterplay with detailed frame data'
  );
}

function createMoveSummary(move: Move): string {
  if (!move.start && !move.end) {
    return `Total Frames: ${move.totalFrames} ${move.notes}`;
  }

  let summary = '';
  if (move.start) {
    summary += `Start: ${move.start} `;
  }
  if (move.end) {
    summary += `End: ${move.end} `;
  }
  if (move.iasa && move.iasa > 0) {
    summary += `IASA: ${move.iasa} `;
  }
  if (move.totalFrames && move.totalFrames > 0) {
    summary += `Total Frames: ${move.totalFrames} `;
  }
  if (move.notes) {
    summary += move.notes;
  }

  return summary;
}
