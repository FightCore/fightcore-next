import { Hitbox } from "@/models/hitbox";
import HitboxTable from "./hitbox-table";
import { Hit } from "@/models/hit";

export interface HitboxSectionParams {
  hits: Hit[];
}

export function HitboxSection(params: Readonly<HitboxSectionParams>) {
  return (
    <div>
      <h2 className="text-xl font-bold">Hitboxes</h2>
      {params.hits.map((hit) => {
        return (
          <div key={hit.id}>
            <h2>DEBUG ID {hit.id}</h2>{" "}
            <span className="text-xl text-bold">
              Frame {hit.start} - {hit.end}
            </span>
            <HitboxTable hitboxes={hit.hitboxes} />
          </div>
        );
      })}
    </div>
  );
}
