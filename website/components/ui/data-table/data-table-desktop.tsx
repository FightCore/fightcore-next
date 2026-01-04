import { DataTableColumn } from '@/models/data-table/data-table-column';
import { DataTableProps } from '@/models/data-table/data-table-props';
import clsx from 'clsx';
import React from 'react';
import { defaultClassNames, getColumnStyle, getRowKey } from './utils';

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
 * Desktop table component with full feature support
 */
export function DataTableDesktop<T>(props: Readonly<DataTableProps<T>>) {
  const {
    data,
    columns,
    rowKeyField,
    striped = false,
    hideHeader = false,
    ariaLabel,
    classNames = {},
    styles = {},
  } = props;

  // Filter out columns that should be hidden on mobile (not applicable for desktop)
  const visibleColumns = columns.filter((col) => !col.hideOnMobile);

  // Merge custom classNames with defaults
  const wrapperClass = clsx(defaultClassNames.wrapper, classNames.wrapper);
  const tableClass = clsx(defaultClassNames.table, classNames.table);
  const theadClass = clsx(defaultClassNames.thead, classNames.thead);
  const tbodyClass = clsx(defaultClassNames.tbody, classNames.tbody);
  const thClass = clsx(defaultClassNames.th, classNames.th);
  const tdClass = clsx(defaultClassNames.td, classNames.td);

  return (
    <div className={wrapperClass} style={styles.wrapper}>
      <table className={tableClass} style={styles.table} aria-label={ariaLabel || 'Data table'} role="table">
        {!hideHeader && (
          <thead className={theadClass}>
            <tr role="row">
              {visibleColumns.map((column) => (
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
        <tbody className={tbodyClass}>
          {data.map((row, rowIndex) => (
            <tr
              key={getRowKey(row, rowIndex, rowKeyField)}
              className={clsx(
                classNames.tr,
                striped && 'group',
                striped && rowIndex % 2 === 1 && 'data-[odd=true]:true',
              )}
              data-odd={striped && rowIndex % 2 === 1}
              role="row"
            >
              {visibleColumns.map((column) => (
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
                  {renderCell(column, row, rowIndex)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
