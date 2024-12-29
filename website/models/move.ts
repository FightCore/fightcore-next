import { AlternativeAnimation } from './alternative-animation';
import { Character } from './character';
import { Hit } from './hit';
import { MoveType } from './move-type';
import { Source } from './source';

export interface Move {
  id: number;
  hits?: Hit[];
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
  webmUrl?: string;
  pngUrl?: string;
  sources?: Source[];
  isInterpolated: boolean;
  alternativeAnimations?: AlternativeAnimation[];
}
