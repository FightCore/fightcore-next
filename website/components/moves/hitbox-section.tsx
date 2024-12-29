import { Hit } from '@/models/hit';
import HitboxTable from './hitboxes/hitbox-table';

export interface HitboxSectionParams {
  hits: Hit[];
}

export function HitboxSection(params: Readonly<HitboxSectionParams>) {
  return (
    <div>
      <h2 className="text-xl font-bold">Hitboxes</h2>
      <HitboxTable hits={params.hits}></HitboxTable>
    </div>
  );
}
