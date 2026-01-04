export interface DataTableGroupConfig<T = any> {
  columnKey: string;
  renderGroupHeader?: (groupKey: string, groupItems: T[]) => React.ReactNode;
  defaultCollapsed?: boolean;
}
