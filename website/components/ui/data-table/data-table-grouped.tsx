import { DataTableColumn } from '@/models/data-table/data-table-column';
import { DataTableGroupConfig } from '@/models/data-table/data-table-group-config';
import { DataTableProps } from '@/models/data-table/data-table-props';
import { GroupedData } from '@/models/data-table/grouped-data';
import clsx from 'clsx';
import React, { useMemo, useState } from 'react';
import { FaAngleDown, FaAngleRight } from 'react-icons/fa6';
import { defaultClassNames, getColumnStyle, getRowKey, groupData } from './utils';

/**
 * Renders a table cell with appropriate formatting and custom renderers
 */
function renderCell<T>(column: DataTableColumn<T>, row: T, rowIndex: number): React.ReactNode {
  const value = column.accessor ? column.accessor(row) : (row as any)[column.key];

  // Use custom renderer if provided
  if (column.render) {
    return column.render(value, row, rowIndex);
  }

  // Default rendering based on dataType
  const className = clsx(
    column.monospace && 'font-mono',
    column.align === 'right' && 'text-right',
    column.align === 'center' && 'text-center',
    column.cellClassName,
  );

  switch (column.dataType) {
    case 'number':
      return <span className={className}>{value}</span>;
    case 'boolean':
      return <span className={className}>{value ? 'Yes' : 'No'}</span>;
    default:
      return <span className={className}>{value}</span>;
  }
}

/**
 * Grouped table component with expand/collapse functionality
 */
export function DataTableGrouped<T>(props: DataTableProps<T> & { groupBy: DataTableGroupConfig<T> }) {
  const {
    data,
    columns,
    rowKeyField,
    groupBy,
    striped = false,
    hideHeader = false,
    ariaLabel,
    classNames = {},
    styles = {},
  } = props;

  // Group the data by the specified column
  const initialGroups = useMemo(
    () => groupData(data, groupBy.columnKey, groupBy.accessor),
    [data, groupBy.columnKey, groupBy.accessor],
  );

  // State to track which groups are expanded
  const [groups, setGroups] = useState<GroupedData<T>[]>(() =>
    initialGroups.map((group) => ({
      ...group,
      isExpanded: !groupBy.defaultCollapsed,
    })),
  );

  // Update groups when data changes
  React.useEffect(() => {
    setGroups((prevGroups) => {
      const newGroups = groupData(data, groupBy.columnKey, groupBy.accessor);
      // Preserve expansion state for existing groups
      return newGroups.map((newGroup) => {
        const existingGroup = prevGroups.find((g) => g.groupKey === newGroup.groupKey);
        return {
          ...newGroup,
          isExpanded: existingGroup ? existingGroup.isExpanded : !groupBy.defaultCollapsed,
        };
      });
    });
  }, [data, groupBy.columnKey, groupBy.defaultCollapsed]);

  // Toggle group expansion
  const toggleGroup = (groupKey: string) => {
    setGroups((prev) => prev.map((g) => (g.groupKey === groupKey ? { ...g, isExpanded: !g.isExpanded } : g)));
  };

  // Merge custom classNames with defaults
  const wrapperClass = clsx(defaultClassNames.wrapper, classNames.wrapper);
  const tableClass = clsx(defaultClassNames.table, classNames.table);
  const theadClass = clsx(defaultClassNames.thead, classNames.thead);
  const tbodyClass = clsx(defaultClassNames.tbody, classNames.tbody);
  const thClass = clsx(defaultClassNames.th, classNames.th);
  const trClass = clsx(defaultClassNames.tr, classNames.tr);
  const tdClass = clsx(defaultClassNames.td, classNames.td);
  const groupRowClass = clsx(defaultClassNames.groupRow, classNames.groupRow);

  return (
    <div className={wrapperClass} style={styles.wrapper}>
      <table className={tableClass} style={styles.table} aria-label={ariaLabel || 'Grouped data table'} role="table">
        {!hideHeader && (
          <thead className={theadClass}>
            <tr role="row">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={clsx(thClass, column.headerClassName)}
                  style={getColumnStyle(column)}
                  role="columnheader"
                  scope="col"
                >
                  {column.renderHeader ? column.renderHeader(column) : column.title || column.key}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody className={tbodyClass} role="rowgroup">
          {groups.map((group) => (
            <React.Fragment key={group.groupKey}>
              {/* Group header row */}
              <tr
                className={clsx(groupRowClass, 'cursor-pointer')}
                onClick={() => toggleGroup(group.groupKey)}
                role="row"
              >
                <td colSpan={columns.length} className={clsx(tdClass, '')}>
                  <div className="flex items-center gap-1">
                    {group.isExpanded ? (
                      <FaAngleDown className="h-4 w-4"></FaAngleDown>
                    ) : (
                      <FaAngleRight className="h-4 w-4"></FaAngleRight>
                    )}
                    {groupBy.renderGroupHeader
                      ? groupBy.renderGroupHeader(group.groupKey, group.items)
                      : group.groupKey}
                  </div>
                </td>
              </tr>

              {/* Group items (if expanded) */}
              {group.isExpanded &&
                group.items.map((item, itemIndex) => (
                  <tr
                    key={getRowKey(item, itemIndex, rowKeyField)}
                    className={clsx(
                      trClass,
                      striped && 'group',
                      striped && itemIndex % 2 === 1 && 'data-[odd=true]:true',
                    )}
                    data-odd={striped && itemIndex % 2 === 1}
                    role="row"
                  >
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={clsx(
                          tdClass,
                          column.cellClassName,
                          column.align === 'right' && 'text-right',
                          column.align === 'center' && 'text-center',
                        )}
                        style={getColumnStyle(column)}
                      >
                        {/* Do not render the group's key cell */}
                        {column.key.toString() === group.groupKey ? <></> : renderCell(column, item, itemIndex)}
                      </td>
                    ))}
                  </tr>
                ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
