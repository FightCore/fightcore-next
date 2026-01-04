import { DataTableColumn } from '@/models/data-table/data-table-column';
import { DataTableGroupConfig } from '@/models/data-table/data-table-group-config';
import { DataTableProps } from '@/models/data-table/data-table-props';
import { GroupedData } from '@/models/data-table/grouped-data';
import clsx from 'clsx';
import React, { useMemo, useState } from 'react';
import { FaAngleDown, FaAngleRight } from 'react-icons/fa6';
import { defaultClassNames, getRowKey, groupData } from './utils';

/**
 * Renders a table cell value with appropriate formatting
 */
function renderCellValue<T>(column: DataTableColumn<T>, row: T, rowIndex: number): React.ReactNode {
  const value = column.accessor ? column.accessor(row) : (row as any)[column.key];

  if (column.render) {
    return column.render(value, row, rowIndex);
  }

  const className = clsx(
    column.monospace && 'font-mono',
    column.align === 'right' && 'text-right',
    column.align === 'center' && 'text-center',
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
 * Mobile grouped table with transpose strategy
 * Shows each group with items in transposed name/value format
 */
export function DataTableMobileGrouped<T>(props: DataTableProps<T> & { groupBy: DataTableGroupConfig<T> }) {
  const { data, columns, rowKeyField, groupBy, hideHeader = false, ariaLabel, classNames = {}, styles = {} } = props;

  // Group the data
  const initialGroups = useMemo(() => groupData(data, groupBy.columnKey, groupBy.accessor), [data, groupBy.columnKey]);

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
      return newGroups.map((newGroup) => {
        const existingGroup = prevGroups.find((group) => group.groupKey === newGroup.groupKey);
        return {
          ...newGroup,
          isExpanded: existingGroup ? existingGroup.isExpanded : !groupBy.defaultCollapsed,
        };
      });
    });
  }, [data, groupBy.columnKey, groupBy.defaultCollapsed]);

  // Toggle group expansion
  const toggleGroup = (groupKey: string) => {
    setGroups((prev) =>
      prev.map((group) => (group.groupKey === groupKey ? { ...group, isExpanded: !group.isExpanded } : group)),
    );
  };

  const wrapperClass = clsx(defaultClassNames.wrapper, classNames.wrapper);
  const tableClass = clsx(defaultClassNames.table, classNames.table);
  const theadClass = clsx(defaultClassNames.thead, classNames.thead);
  const tbodyClass = clsx(defaultClassNames.tbody, classNames.tbody);
  const thClass = clsx(defaultClassNames.th, classNames.th);
  const tdClass = clsx(defaultClassNames.td, classNames.td);
  const groupRowClass = clsx(defaultClassNames.groupRow, classNames.groupRow);

  return (
    <div className={wrapperClass} style={styles.wrapper}>
      {groups.map((group) => (
        <div key={group.groupKey} className="mb-4 last:mb-0">
          {/* Group header */}
          <div
            className={clsx(groupRowClass, 'mb-2 cursor-pointer rounded-md p-3')}
            onClick={() => toggleGroup(group.groupKey)}
            role="button"
            aria-expanded={group.isExpanded}
          >
            <div className="flex items-center gap-2">
              {group.isExpanded ? (
                <FaAngleDown className="h-4 w-4 flex-shrink-0" />
              ) : (
                <FaAngleRight className="h-4 w-4 flex-shrink-0" />
              )}
              <span className="font-medium">
                {groupBy.renderGroupHeader ? groupBy.renderGroupHeader(group.groupKey, group.items) : group.groupKey}
              </span>
            </div>
          </div>

          {/* Group items (transposed format) */}
          {group.isExpanded &&
            group.items.map((dataItem, dataIndex) => (
              <table
                key={getRowKey(dataItem, dataIndex, rowKeyField)}
                className={clsx(tableClass, dataIndex > 0 && 'mt-4')}
                style={styles.table}
                aria-label={ariaLabel || 'Grouped data table'}
                role="table"
              >
                {!hideHeader && (
                  <thead className={theadClass}>
                    <tr role="row">
                      <th className={thClass} role="columnheader" scope="col">
                        Name
                      </th>
                      <th className={thClass} role="columnheader" scope="col">
                        Value
                      </th>
                    </tr>
                  </thead>
                )}
                <tbody className={tbodyClass}>
                  {columns.map((column) => {
                    return (
                      <tr key={column.key} role="row">
                        <td className={tdClass}>{column.title || column.key}</td>
                        <td className={tdClass}>{renderCellValue(column, dataItem, dataIndex)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ))}
        </div>
      ))}
    </div>
  );
}
