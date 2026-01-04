import { DataTableProps } from '@/models/data-table/data-table-props';
import { DataTableDesktop } from './data-table-desktop';
import { DataTableGrouped } from './data-table-grouped';
import { DataTableMobile } from './data-table-mobile';
import { DataTableMobileGrouped } from './data-table-mobile-grouped';

export function DataTable<T = any>(props: Readonly<DataTableProps<T>>) {
  // If grouping enabled, use grouped components (both desktop and mobile)
  if (props.groupBy) {
    return (
      <>
        <div className="hidden md:block">
          <DataTableGrouped {...props} groupBy={props.groupBy} />
        </div>
        <div className="block md:hidden">
          <DataTableMobileGrouped {...props} groupBy={props.groupBy} />
        </div>
      </>
    );
  }

  // Default: responsive (both desktop and mobile)
  return (
    <>
      <div className="hidden md:block">
        <DataTableDesktop {...props} />
      </div>
      <div className="block md:hidden">
        <DataTableMobile {...props} />
      </div>
    </>
  );
}
