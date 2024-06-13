import { Character } from "./character";
import { Hitbox } from "./hitbox";
import { MoveType } from "./move-type";
import { Source } from "./source";

export interface Move {
  id: number;
  hitboxes?: Hitbox[];
  name: string;
  normalizedName: string;
  landLag?: number;
  lCanceledLandLag?: number;
  totalFrames: number;
  iasa?: number;
  autoCancelBefore?: number;
  autoCancelAfter?: number;
  type: MoveType;
  start?: number;
  end?: number;
  notes?: string;
  source?: string;
  character?: Character;
  characterId?: number;
  landingFallSpecialLag?: number;
  gifUrl?: string;
  sources?: Source[];
  isInterpolated: boolean;
}
