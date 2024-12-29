import { Character, CharacterBase } from '@/models/character';
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
  return metaConfig.baseDescription(`${character.name} ${move.name}`);
}

export function crouchCancelMetaDescription(character: CharacterBase): string {
  return metaConfig.baseDescription(`${character.name} crouch cancel information`);
}
