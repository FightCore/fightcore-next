import { Hitbox } from "@/models/hitbox";
import { CrouchCancelTable } from "./crouch-cancel-table";
import { Hit } from "@/models/hit";

export interface CrouchCancelSectionParams {
  hits: Hit[];
}

export function CrouchCancelSection(params: Readonly<CrouchCancelSectionParams>) {
  const hitboxes = params.hits.flatMap((hit) => hit.hitboxes);
  return (
    <div>
      <h2 className="text-xl font-bold">Crouch Cancel Percentages</h2>
      <p className="mb-2">
        The following percentages indicate when ASDI Down and Crouch Cancel are broken for this move. This is dependant
        which hitbox you are hit with.
      </p>
      <CrouchCancelTable hitboxes={hitboxes} />
    </div>
  );
}
