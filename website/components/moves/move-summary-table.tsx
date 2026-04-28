import { MovePropertySummary } from '@/utilities/move-summary';
import { Card } from '@heroui/react';

interface MoveSummaryTableProps {
  moveSummary: MovePropertySummary[];
}

export function MoveSummaryTable({ moveSummary }: MoveSummaryTableProps) {
  const notes = moveSummary.filter((summary) => summary.variant === 'note');
  const normalSummaries = moveSummary.filter((summary) => !summary.variant);

  return (
    <Card.Root>
      <Card.Header>
        <Card.Title>Frame Data</Card.Title>
      </Card.Header>
      <Card.Content>
        {normalSummaries.map((property) => (
          <div key={property.name} className="flex items-center justify-between py-1">
            <span className="font-bold">{property.name}</span>
            <span
              className={`rounded px-2 py-0.5 text-sm ${
                property.level === 'warning'
                  ? 'bg-warning text-white'
                  : 'bg-surface-secondary text-foreground'
              }`}
            >
              {property.value}
            </span>
          </div>
        ))}

        {notes.length > 0 && (
          <div className="flex flex-col gap-2 py-1.5">
            <span className="font-bold">Notes</span>
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
          </div>
        )}
      </Card.Content>
    </Card.Root>
  );
}
