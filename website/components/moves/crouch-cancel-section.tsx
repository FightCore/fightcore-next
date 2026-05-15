import { FightcoreCard } from '@/components/ui/fightcore-card';
import { Hit } from '@/models/hit';
import { CrouchCancelTable } from './crouch-cancel-table';

export interface CrouchCancelSectionParams {
  hits: Hit[];
}

export function CrouchCancelSection(params: Readonly<CrouchCancelSectionParams>) {
  return (
    <FightcoreCard>
      <FightcoreCard.Header>
        <FightcoreCard.Title>Knockdown Thresholds</FightcoreCard.Title>
        <FightcoreCard.Subtitle>
          The following percentages indicate when this move starts knocking down. Separate tables are shown based on
          whether the target is Crouch-Cancelling or not.
        </FightcoreCard.Subtitle>
      </FightcoreCard.Header>
      <FightcoreCard.Body>
        <CrouchCancelTable hits={params.hits} />
      </FightcoreCard.Body>
    </FightcoreCard>
  );
}
