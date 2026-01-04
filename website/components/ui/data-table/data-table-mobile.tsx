import React from 'react';
import clsx from 'clsx';
import { DataTableProps, DataTableColumn } from './types';
import { getRowKey, defaultClassNames } from './utils';

/**
 * Renders a table cell value with appropriate formatting
 */
function renderCellValue<T>(
  column: DataTableColumn<T>,
  row: T,
  rowIndex: number
): React.ReactNode {
  const value = column.accessor ? column.accessor(row) : (row as any)[column.key];

  if (column.render) {
    return column.render(value, row, rowIndex);
  }

  const className = clsx(
    column.monospace && 'font-mono',
    column.align === 'right' && 'text-right',
    column.align === 'center' && 'text-center'
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
 * Mobile table component with transpose strategy
 * Converts horizontal columns into vertical key-value rows
 */
function TransposedMobileTable<T>(props: DataTableProps<T>) {
  const {
    data,
    columns,
    rowKeyField,
    hideHeader = false,
    ariaLabel,
    classNames = {},
    styles = {},
  } = props;

  // For transpose strategy, we show each data item as a separate table
  // with columns transposed to rows (name/value pairs)
  const wrapperClass = clsx(defaultClassNames.wrapper, classNames.wrapper);
  const tableClass = clsx(defaultClassNames.table, classNames.table);
  const theadClass = clsx(defaultClassNames.thead, classNames.thead);
  const tbodyClass = clsx(defaultClassNames.tbody, classNames.tbody);
  const thClass = clsx(defaultClassNames.th, classNames.th);
  const tdClass = clsx(defaultClassNames.td, classNames.td);

  return (
    <div className={wrapperClass} style={styles.wrapper}>
      {data.map((dataItem, dataIndex) => (
        <table
          key={getRowKey(dataItem, dataIndex, rowKeyField)}
          className={clsx(tableClass, dataIndex > 0 && 'mt-4')}
          style={styles.table}
          aria-label={ariaLabel || 'Data table'}
          role="table"
        >
          {!hideHeader && (
            <thead className={theadClass} role="rowgroup">
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
          <tbody className={tbodyClass} role="rowgroup">
            {columns.map((column, colIndex) => (
              <tr key={column.key} role="row">
                <td className={clsx(tdClass)} role="cell">
                  {column.title || column.key}
                </td>
                <td className={clsx(tdClass)} role="cell">
                  {renderCellValue(column, dataItem, dataIndex)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ))}
    </div>
  );
}

/**
 * Mobile table component with hide-columns strategy
 * Shows only columns that are not marked as hideOnMobile
 */
function HideColumnsMobileTable<T>(props: DataTableProps<T>) {
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

  // Filter out columns marked as hideOnMobile
  const visibleColumns = columns.filter((col) => !col.hideOnMobile);

  const wrapperClass = clsx(defaultClassNames.wrapper, classNames.wrapper);
  const tableClass = clsx(defaultClassNames.table, classNames.table);
  const theadClass = clsx(defaultClassNames.thead, classNames.thead);
  const tbodyClass = clsx(defaultClassNames.tbody, classNames.tbody);
  const thClass = clsx(defaultClassNames.th, classNames.th);
  const tdClass = clsx(defaultClassNames.td, classNames.td);

  return (
    <div className={wrapperClass} style={styles.wrapper}>
      <table
        className={tableClass}
        style={styles.table}
        aria-label={ariaLabel || 'Data table'}
        role="table"
      >
        {!hideHeader && (
          <thead className={theadClass} role="rowgroup">
            <tr role="row">
              {visibleColumns.map((column) => (
                <th
                  key={column.key}
                  className={clsx(thClass, column.headerClassName)}
                  role="columnheader"
                  scope="col"
                >
                  {column.renderHeader
                    ? column.renderHeader(column)
                    : column.title || column.key}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody className={tbodyClass} role="rowgroup">
          {data.map((row, rowIndex) => (
            <tr
              key={getRowKey(row, rowIndex, rowKeyField)}
              className={clsx(
                classNames.tr,
                striped && 'group',
                striped && rowIndex % 2 === 1 && 'data-[odd=true]:true'
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
                    column.align === 'center' && 'text-center'
                  )}
                  role="cell"
                >
                  {renderCellValue(column, row, rowIndex)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Mobile table component that selects appropriate strategy
 */
export function DataTableMobile<T>(props: DataTableProps<T>) {
  const { responsive } = props;

  // Default to hide-columns strategy if no responsive config
  if (!responsive || responsive.strategy === 'hide-columns') {
    return <HideColumnsMobileTable {...props} />;
  }

  if (responsive.strategy === 'transpose') {
    return <TransposedMobileTable {...props} />;
  }

  // Custom strategy handled by parent component
  if (responsive.strategy === 'custom' && responsive.customMobileRender) {
    return <>{responsive.customMobileRender(props.data)}</>;
  }

  // Fallback to hide-columns
  return <HideColumnsMobileTable {...props} />;
}
