import { Character, CharacterBase } from "@/models/character";
import { Move } from "@/models/move";

export const metaConfig = {
  tags: [
    "Super Smash Bros. Melee",
    "Melee frame data",
    "hitbox data",
    "move stats",
    "Smash Bros",
    "SSBM",
    "FightCore",
    "frame data",
    "crouch cancel percentages",
    "hitlag",
    "hitstun",
    "shieldstun",
  ],
  baseDescription: (middleSection: string) =>
    `Modern mobile-friendly frame data for ${middleSection} Super Smash Bros Melee`,
};

export function characterMetaDescription(character: CharacterBase): string {
  return metaConfig.baseDescription(`${character.name} in `);
}

export function moveMetaDescription(
  character: CharacterBase,
  move: Move
): string {
  return metaConfig.baseDescription(`${character.name} ${move.name} in `);
}
