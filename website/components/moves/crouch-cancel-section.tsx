import { Hit } from '@/models/hit';
import { CrouchCancelTable } from './crouch-cancel-table';

export interface CrouchCancelSectionParams {
  hits: Hit[];
}

export function CrouchCancelSection(params: Readonly<CrouchCancelSectionParams>) {
  return (
    <div>
      <h2 className="my-3 text-xl font-bold">Crouch Cancel Percentages</h2>
      <p className="mb-2">
        The following percentages indicate when ASDI Down and Crouch Cancel are broken for this move. This is dependant
        which hitbox you are hit with.
      </p>
      <CrouchCancelTable hits={params.hits} />
    </div>
  );
}
