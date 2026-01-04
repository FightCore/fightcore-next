import { DataTableColumn } from '@/models/data-table/data-table-column';
import { GroupedData } from '@/models/data-table/grouped-data';

export function getRowKey<T>(row: T, index: number, keyField?: string): string {
  // Check if the row contains the the key and if so use it as the key.
  if (keyField && row && typeof row === 'object' && keyField in row) {
    return String((row as any)[keyField]);
  }

  return `row-${index}`;
}

export function groupData<T>(data: T[], columnKey: string): GroupedData<T>[] {
  const groups = new Map<string, T[]>();

  for (const item of data) {
    const groupKey = String((item as any)[columnKey]);
    if (!groups.has(groupKey)) {
      groups.set(groupKey, []);
    }
    groups.get(groupKey)!.push(item);
  }

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
 * Default class names for table parts (matching existing HeroUI/ka-table styles)
 */
export const defaultClassNames = {
  wrapper: 'bg-white dark:bg-gray-800 shadow-none rounded-md p-3',
  table: 'w-full',
  th: 'bg-transparent text-default-500 text-xs text-left px-3 py-2',
  td: 'px-3 py-1 text-md',
  groupRow: 'dark:bg-gray-700 bg-gray-100 py-2',
  thead: '',
  tbody: '',
};
