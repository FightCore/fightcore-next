import { Move } from './move';
import { CharacterStatistics } from './character-statistics';
import { CharacterInfo } from './character-info';

export interface Character extends CharacterBase {
  moves: Move[];
}

export interface CharacterBase {
  name: string;
  normalizedName: string;
  fightCoreId: number;
  characterStatistics: CharacterStatistics;
  characterInfo: CharacterInfo;
}
