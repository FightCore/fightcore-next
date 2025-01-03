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
    'hitlag',
    'hitstun',
    'shieldstun',
  ],
  baseDescription: (middleSection: string) =>
    `Modern mobile-friendly frame data for ${middleSection} in Super Smash Bros Melee`,
};

export function characterMetaDescription(character: CharacterBase): string {
  return metaConfig.baseDescription(`${character.name}`);
}

export function moveMetaDescription(character: CharacterBase, move: Move): string {
  const moveSummary = createMoveSummary(move);
  const pageName = `${character.name} ${move.name}`;
  const siteDescription = metaConfig.baseDescription(pageName);

  return `${moveSummary} | ${siteDescription}`;
}

export function crouchCancelMetaDescription(character: CharacterBase): string {
  return metaConfig.baseDescription(`${character.name} crouch cancel information`);
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
