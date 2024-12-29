import { CharacterBase } from '@/models/character';
import { Move } from '@/models/move';

export interface ExportedMove extends Move {
  characterName: string;
  normalizedCharacterName: string;
  // TODO move to Move.
  isInterpolated: boolean;
}
