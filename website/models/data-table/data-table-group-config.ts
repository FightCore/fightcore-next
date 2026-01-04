export interface DataTableGroupConfig<T = any> {
  columnKey?: string;
  accessor?: (row: T) => any;
  renderGroupHeader?: (groupKey: string, groupItems: T[]) => React.ReactNode;
  defaultCollapsed?: boolean;
}
