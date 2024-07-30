import { Hit } from "@/models/hit";
import { Hitbox } from "@/models/hitbox";

export interface FlattenedHitbox extends Hitbox {
  hit: string;
  hitObjects: Hit[];
}

export function flattenData(hits: Hit[]): FlattenedHitbox[] {
  return hits.flatMap((hit) =>
    hit.hitboxes.flatMap((hitbox) => ({
      hit: hit.start + " - " + hit.end,
      hitObjects: [hit],
      ...hitbox,
    }))
  );
}
