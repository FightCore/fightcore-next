import { DataTableProps } from '@/models/data-table/data-table-props';
import { DataTableDesktop } from './data-table-desktop';
import { DataTableGrouped } from './data-table-grouped';
import { DataTableMobile } from './data-table-mobile';

/**
 * Unified DataTable component that handles all table rendering scenarios
 *
 * Features:
 * - Desktop/mobile responsive variants
 * - Row grouping with expand/collapse
 * - Custom cell rendering
 * - Row striping
 * - Dark/light theme support
 * - Flexible styling via classNames and styles props
 *
 * @example
 * // Simple table
 * <DataTable
 *   data={users}
 *   columns={[
 *     { key: 'name', title: 'Name' },
 *     { key: 'email', title: 'Email' },
 *   ]}
 * />
 *
 * @example
 * // Grouped table
 * <DataTable
 *   data={hitboxes}
 *   columns={columns}
 *   groupBy={{
 *     columnKey: 'hit',
 *     renderGroupHeader: (key, items) => <>{key}</>
 *   }}
 * />
 *
 * @example
 * // Responsive with transpose strategy
 * <DataTable
 *   data={[move]}
 *   columns={columns}
 *   responsive={{ strategy: 'transpose' }}
 * />
 */
export function DataTable<T = any>(props: Readonly<DataTableProps<T>>) {
  // If grouping enabled, use grouped component
  if (props.groupBy) {
    return <DataTableGrouped {...props} groupBy={props.groupBy} />;
  }

  // Default: responsive (both desktop and mobile)
  return (
    <>
      <div className="hidden md:block">
        <DataTableDesktop {...props} />
      </div>
      <div className="block md:hidden">
        {props.responsive?.strategy === 'custom' && props.responsive.customMobileRender ? (
          props.responsive.customMobileRender(props.data)
        ) : (
          <DataTableMobile {...props} />
        )}
      </div>
    </>
  );
}
