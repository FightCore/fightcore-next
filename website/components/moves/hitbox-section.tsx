import { FightcoreCard } from '@/components/ui/fightcore-card';
import { Hit } from '@/models/hit';
import HitboxTable from './hitboxes/hitbox-table';

export interface HitboxSectionParams {
  hits: Hit[];
}

export function HitboxSection(params: Readonly<HitboxSectionParams>) {
  return (
    <FightcoreCard>
      <FightcoreCard.Header>
        <FightcoreCard.Title>Hitboxes</FightcoreCard.Title>
      </FightcoreCard.Header>
      <FightcoreCard.Body>
        <HitboxTable hits={params.hits}></HitboxTable>
      </FightcoreCard.Body>
    </FightcoreCard>
  );
}
