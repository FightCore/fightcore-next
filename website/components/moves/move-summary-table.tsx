import { MovePropertySummary } from '@/utilities/move-summary';

interface MoveSummaryTableProps {
  moveSummary: MovePropertySummary[];
}

export function MoveSummaryTable({ moveSummary }: MoveSummaryTableProps) {
  const notes = moveSummary.filter((summary) => summary.variant === 'note');
  const normalSummaries = moveSummary.filter((summary) => !summary.variant);

  return (
    <div className="mt-2 rounded-lg bg-slate-800 p-4 dark:bg-slate-900">
      {normalSummaries.map((property, index) => (
        <div
          key={property.name}
          className={`flex items-center justify-between py-1.5 ${
            index !== normalSummaries.length - 1 || notes.length > 0 ? 'border-b border-slate-700' : ''
          }`}
        >
          <span className="font-bold">{property.name}</span>
          <span
            className={`font rounded px-2 py-0.5 ${
              property.level === 'warning' ? 'bg-orange-600 text-white' : 'bg-red-900 text-white'
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
                property.level === 'warning' ? 'bg-orange-600 text-white' : 'text-white'
              }`}
            >
              {property.value}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
