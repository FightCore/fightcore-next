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
    'hitlag',
    'hitstun',
    'shieldstun',
  ],
};

export function indexMetaDescription(): string {
  return 'Complete Super Smash Bros. Melee frame data with interactive hitbox visualizations, crouch cancel calculator, and detailed move analysis for every character.';
}

export function characterMetaDescription(character: CharacterBase): string {
  return `Complete ${character.name} frame data for Super Smash Bros. Melee: hitboxes, knockback values, startup frames, and crouch cancel percentages for every move.`;
}

export function moveMetaDescription(character: CharacterBase, move: Move): string {
  return `${character.name} ${move.name} frame data for Super Smash Bros. Melee: hitboxes, knockback, startup and active frames with frame-by-frame animations.`;
}

export function crouchCancelMetaDescription(character: CharacterBase): string {
  return `${character.name} Crouch Cancel Calculator for Melee. Find exact knockdown and ASDI Down percentages for every move in the game.`;
}

export function moveSocialDescription(character: CharacterBase, move: Move): string {
  const moveSummary = createMoveSummary(move);
  const siteDescription =
    `${character.name}'s ${move.name} frame data in Super Smash Bros. Melee. ` +
    'View hitboxes, knockback values, and frame-by-frame animations on FightCore.';

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
