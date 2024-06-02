import { Hitbox } from "@/models/hitbox";
import HitboxTable from "./hitbox-table";

export interface HitboxSectionParams {
  hitboxes: Hitbox[];
}

export function HitboxSection(params: Readonly<HitboxSectionParams>) {
  return (
    <div>
      <h2 className="text-xl font-bold">Hitboxes</h2>
      <HitboxTable hitboxes={params.hitboxes} />
    </div>
  );
}
