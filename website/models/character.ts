import { CharacterStatistics } from './character-statistics';
import { Move } from './move';

export interface Character extends CharacterBase {
  moves: Move[];
}

export interface CharacterBase {
  name: string;
  normalizedName: string;
  fightCoreId: number;
  characterStatistics: CharacterStatistics;
}
