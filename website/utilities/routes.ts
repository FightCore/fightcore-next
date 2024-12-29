import { CharacterBase } from '@/models/character';
import { Move } from '@/models/move';

export function characterRoute(character: CharacterBase): string {
  return `/characters/${character.fightCoreId}/${encodeURIComponent(character.normalizedName)}/`;
}

export function moveRoute(character: CharacterBase, move: Move): string {
  return `/characters/${character.fightCoreId}/${encodeURIComponent(
    character.normalizedName,
  )}/moves/${move.id}/${move.normalizedName}/`;
}

export function crouchCancelCharacterRoute(character: CharacterBase): string {
  return `/crouch-cancel-calculator/${character.fightCoreId}/${encodeURIComponent(character.normalizedName)}/`;
}
