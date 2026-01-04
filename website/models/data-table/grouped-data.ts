export interface GroupedData<T> {
  groupKey: string;
  items: T[];
  isExpanded: boolean;
}
