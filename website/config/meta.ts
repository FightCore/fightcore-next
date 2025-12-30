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
  return 'Complete Super Smash Bros. Melee frame data with interactive hitbox visualizations, crouch cancel calculator, and detailed move analysis for every character.';
}

export function characterMetaDescription(character: CharacterBase): string {
  return `Complete ${character.name} frame data for Super Smash Bros. Melee. View hitboxes, knockback, move stats, and crouch cancel percentages with interactive visualizations.`;
}

export function moveMetaDescription(character: CharacterBase, move: Move): string {
  return `${character.name} ${move.name} frame data for Melee: startup frames, hitboxes, knockback values, and interactive animations. Master every detail of this move.`;
}

export function crouchCancelMetaDescription(character: CharacterBase): string {
  return `${character.name} Crouch Cancel Calculator for Melee. Calculate knockdown percentages, ASDI Down thresholds, and optimize your defensive game with precise data.`;
}

export function moveSocialDescription(character: CharacterBase, move: Move): string {
  const moveSummary = createMoveSummary(move);
  const siteDescription =
    `${character.name}'s ${move.name} frame data in Super Smash Bros. Melee. ` +
    'Analyze startup, active, and end frames, plus hitbox placement with interactive visualizations.';

  return moveSummary ? `${moveSummary} | ${siteDescription}` : siteDescription;
}

function createMoveSummary(move: Move): string {
  if (!move.start && !move.end) {
    return move.totalFrames ? `Total Frames: ${move.totalFrames}` : '';
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
    summary += `Total Frames: ${move.totalFrames}`;
  }

  return summary.trim();
}
