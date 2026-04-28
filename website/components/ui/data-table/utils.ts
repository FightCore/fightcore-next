import { DataTableColumn } from '@/models/data-table/data-table-column';
import { GroupedData } from '@/models/data-table/grouped-data';

export function getRowKey<T>(row: T, index: number, keyField?: string): string {
  // Check if the row contains the the key and if so use it as the key.
  if (keyField && row && typeof row === 'object' && keyField in row) {
    return String((row as any)[keyField]);
  }

  return `row-${index}`;
}

export function groupData<T>(data: T[], keyColumn?: string, accessor?: (row: T) => any): GroupedData<T>[] {
  const groups = new Map<string, T[]>();

  // Go over all items based on the provided keyColumn.
  // If value of the keyColumn is in the dictionary, add it to the array.
  // Otherwise we create a new entry with those values.
  for (const item of data) {
    const groupKey = accessor ? accessor(item) : String((item as any)[keyColumn!]);
    if (groups.has(groupKey)) {
      groups.get(groupKey)!.push(item);
      continue;
    }

    groups.set(groupKey, [item]);
  }

  // Convert the map to an array.
  return Array.from(groups.entries()).map(([groupKey, items]) => ({
    groupKey,
    items,
    isExpanded: true,
  }));
}

export function getColumnStyle(column: DataTableColumn): React.CSSProperties {
  if (!column.width) return {};

  return {
    width: typeof column.width === 'number' ? `${column.width}px` : column.width,
    minWidth: typeof column.width === 'number' ? `${column.width}px` : undefined,
  };
}

/**
 * Default class names for table parts
 */
export const defaultClassNames = {
  wrapper: 'bg-surface shadow-none rounded-md p-3',
  table: 'w-full',
  th: 'bg-transparent text-default-500 text-xs text-left px-3 py-2',
  td: 'px-3 py-1 text-md',
  tr: 'data-[odd=true]:bg-surface-secondary',
  groupRow: 'border border-[var(--border)] py-2',
  thead: '',
  tbody: '',
};
