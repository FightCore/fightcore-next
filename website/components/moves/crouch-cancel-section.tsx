import { Hit } from '@/models/hit';
import { CrouchCancelTable } from './crouch-cancel-table';

export interface CrouchCancelSectionParams {
  hits: Hit[];
}

export function CrouchCancelSection(params: Readonly<CrouchCancelSectionParams>) {
  return (
    <div>
      <h2 className="my-3 text-xl font-bold">Knockdown Thresholds</h2>
      <p className="mb-2">
        The following percentages indicate when this move starts knocking down. Separate tables are shown based on whether the target is Crouch-Cancelling or not.
      </p>
      <CrouchCancelTable hits={params.hits} />
    </div>
  );
}
