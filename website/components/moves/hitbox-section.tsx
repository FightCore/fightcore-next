import { Hitbox } from "@/models/hitbox";
import HitboxTable from "./hitbox-table";
import { Hit } from "@/models/hit";
import { Card, CardBody, CardHeader } from "@nextui-org/card";

export interface HitboxSectionParams {
  hits: Hit[];
}

export function HitboxSection(params: Readonly<HitboxSectionParams>) {
  return (
    <div>
      <h2 className="text-xl font-bold">Hitboxes</h2>
      {params.hits.map((hit) => {
        return (
          <Card key={hit.id} className="dark:bg-gray-700 mb-1">
            <CardHeader>
              <span className="text-xl text-bold">
                Frame {hit.start} - {hit.end}
              </span>
            </CardHeader>
            <CardBody>
              <HitboxTable hitboxes={hit.hitboxes} />
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
}
