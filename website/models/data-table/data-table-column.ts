export interface DataTableColumn<T = any> {
  key: string;
  title?: string;
  width?: number | string;
  dataType?: 'string' | 'number' | 'boolean' | 'custom';

  render?: (value: any, row: T, rowIndex: number) => React.ReactNode;
  renderHeader?: (column: DataTableColumn<T>) => React.ReactNode;
  accessor?: (row: T) => any;

  cellClassName?: string;
  headerClassName?: string;
  align?: 'left' | 'center' | 'right';

  monospace?: boolean;
}
