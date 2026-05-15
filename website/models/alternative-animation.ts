import { AnimationCredit } from '@/models/animation-credit';

export interface AlternativeAnimation {
  description: string;
  gifUrl: string;
  webmUrl: string;
  pngUrl: string;
  credit: AnimationCredit;
}
