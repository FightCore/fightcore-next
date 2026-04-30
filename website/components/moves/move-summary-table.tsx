import { FightcoreCard } from '@/components/ui/fightcore-card';
import { MovePropertySummary } from '@/utilities/move-summary';

interface MoveSummaryTableProps {
  moveSummary: MovePropertySummary[];
}

export function MoveSummaryTable({ moveSummary }: Readonly<MoveSummaryTableProps>) {
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
      {notes.length > 0 &&
        notes.map((note) => (
          <FightcoreCard key={note.name}>
            <FightcoreCard.Header>
              <FightcoreCard.Title>{note.name}</FightcoreCard.Title>
            </FightcoreCard.Header>
            <FightcoreCard.Body>
              <span className={`rounded text-sm`}>{note.value}</span>
            </FightcoreCard.Body>
          </FightcoreCard>
        ))}
    </div>
  );
}
