import { FightcoreCard } from '@/components/ui/fightcore-card';
import { MovePropertySummary } from '@/utilities/move-summary';

interface MoveSummaryTableProps {
  moveSummary: MovePropertySummary[];
}

export function MoveSummaryTable({ moveSummary }: MoveSummaryTableProps) {
  const notes = moveSummary.filter((summary) => summary.variant === 'note');
  const normalSummaries = moveSummary.filter((summary) => !summary.variant);

  return (
    <div className="flex flex-col gap-3">
      <FightcoreCard>
        <FightcoreCard.Header>
          <FightcoreCard.Title className="text-muted-foreground font-semibold">Frame Data</FightcoreCard.Title>
        </FightcoreCard.Header>
        <FightcoreCard.Body>
          {normalSummaries.map((property) => (
            <div key={property.name} className="flex items-center justify-between">
              <span className="text-sm font-semibold">{property.name}</span>
              <span
                className={`rounded px-2 py-0.5 text-sm ${
                  property.level === 'warning' ? 'bg-warning text-white' : 'bg-surface-secondary text-foreground'
                }`}
              >
                {property.value}
              </span>
            </div>
          ))}
        </FightcoreCard.Body>
      </FightcoreCard>
      {notes.length > 0 && (
        <FightcoreCard>
          <FightcoreCard.Header>
            <FightcoreCard.Title>Notes</FightcoreCard.Title>
          </FightcoreCard.Header>
          <FightcoreCard.Body>
            {notes.map((property) => (
              <span
                key={property.name}
                className={`rounded px-2 py-0.5 text-sm ${
                  property.level === 'warning' ? 'bg-warning text-white' : 'text-foreground'
                }`}
              >
                {property.value}
              </span>
            ))}
          </FightcoreCard.Body>
        </FightcoreCard>
      )}
    </div>
  );
}
