import { MovePropertySummary } from '@/utilities/move-summary';
import { Card } from '@heroui/react';

interface MoveSummaryTableProps {
  moveSummary: MovePropertySummary[];
}

export function MoveSummaryTable({ moveSummary }: MoveSummaryTableProps) {
  const notes = moveSummary.filter((summary) => summary.variant === 'note');
  const normalSummaries = moveSummary.filter((summary) => !summary.variant);

  return (
    <Card>
      <Card.Header>Frame Data</Card.Header>
      <Card.Content>
        {normalSummaries.map((property, index) => (
          <div key={property.name} className={`flex items-center justify-between py-1`}>
            <span className="font-bold">{property.name}</span>
            <span
              className={`font rounded px-2 py-0.5 ${
                property.level === 'warning'
                  ? 'bg-orange-500 text-white dark:bg-orange-600'
                  : 'border border-red-500 bg-red-500 text-red-500 dark:bg-red-950'
              }`}
            >
              {property.value}
            </span>
          </div>
        ))}

        {notes.length > 0 && (
          <div key="notes" className="flex flex-col gap-2 py-1.5">
            <span className="font-bold">Notes</span>
            {notes.map((property) => (
              <span
                className={`rounded px-2 py-0.5 ${
                  property.level === 'warning' ? 'bg-orange-500 text-white dark:bg-orange-600' : 'text-white'
                }`}
              >
                {property.value}
              </span>
            ))}
          </div>
        )}
      </Card.Content>
    </Card>
  );
}
