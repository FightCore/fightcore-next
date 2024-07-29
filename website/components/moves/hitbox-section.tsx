import { Hit } from "@/models/hit";
import NewHitboxTable2 from "./hitboxes/new-hitbox-table-2";

export interface HitboxSectionParams {
  hits: Hit[];
}

export function HitboxSection(params: Readonly<HitboxSectionParams>) {
  return (
    <div>
      <h2 className="text-xl font-bold">Hitboxes</h2>
      <NewHitboxTable2 hits={params.hits}></NewHitboxTable2>
    </div>
  );
}
