import { MovePropertySummary } from '@/utilities/move-summary';

interface MoveSummaryTableProps {
  moveSummary: MovePropertySummary[];
}

export function MoveSummaryTable({ moveSummary }: MoveSummaryTableProps) {
  return (
    <div className="mt-2 rounded-lg bg-slate-800 p-2 dark:bg-slate-900">
      {moveSummary
        .filter((summary) => !summary.variant)
        .map((property, index) => (
          <div
            key={property.name}
            className={`flex items-center justify-between py-1.5 ${
              index !== moveSummary.length - 1 ? 'border-b border-slate-700' : ''
            }`}
          >
            <span className="text-sm font-bold text-slate-300">{property.name}</span>
            <span
              className={`rounded px-2 py-0.5 font-mono text-sm ${
                property.level === 'warning' ? 'bg-orange-600 text-white' : 'bg-red-900 text-white'
              }`}
            >
              {property.value}
            </span>
          </div>
        ))}

      <div key="notes" className="flex flex-col gap-1 py-1.5">
        <span className="text-sm font-bold text-slate-300">Notes</span>
        {moveSummary
          .filter((summary) => summary.variant === 'note')
          .map((property, index) => (
            <span
              className={`rounded px-2 py-0.5 font-mono text-sm ${
                property.level === 'warning' ? 'bg-orange-600 text-white' : 'bg-red-900 text-white'
              }`}
            >
              {property.value}
            </span>
          ))}
      </div>
    </div>
  );
}
