import { DataTableColumn } from '@/models/data-table/data-table-column';
import { DataTableGroupConfig } from '@/models/data-table/data-table-group-config';

export interface DataTableProps<T = any> {
  data: T[];
  columns: DataTableColumn<T>[];
  rowKeyField?: string;
  groupBy?: DataTableGroupConfig<T>;
  striped?: boolean;
  hideHeader?: boolean;
  ariaLabel?: string;
  classNames?: {
    wrapper?: string | string[];
    table?: string;
    thead?: string;
    tbody?: string;
    th?: string | string[];
    tr?: string;
    td?: string | string[];
    groupRow?: string;
  };

  /** Custom styles for table parts */
  styles?: {
    wrapper?: React.CSSProperties;
    table?: React.CSSProperties;
  };
}
