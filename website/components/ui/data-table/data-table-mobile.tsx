import { DataTableColumn } from '@/models/data-table/data-table-column';
import { DataTableProps } from '@/models/data-table/data-table-props';
import clsx from 'clsx';
import React from 'react';
import { defaultClassNames, getRowKey } from './utils';

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
 * Mobile table component with transpose strategy
 * Converts horizontal columns into vertical key-value rows
 */
export function DataTableMobile<T>(props: Readonly<DataTableProps<T>>) {
  const { data, columns, rowKeyField, striped = false, hideHeader = false, ariaLabel, classNames = {}, styles = {} } = props;

  // For transpose strategy, we show each data item as a separate table
  // with columns transposed to rows (name/value pairs)
  const wrapperClass = clsx(defaultClassNames.wrapper, classNames.wrapper);
  const tableClass = clsx(defaultClassNames.table, classNames.table);
  const theadClass = clsx(defaultClassNames.thead, classNames.thead);
  const tbodyClass = clsx(defaultClassNames.tbody, classNames.tbody);
  const thClass = clsx(defaultClassNames.th, classNames.th);
  const trClass = clsx(defaultClassNames.tr, classNames.tr);
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
            {columns.map((column, colIndex) => (
              <tr
                key={column.key}
                className={clsx(
                  trClass,
                  striped && 'group',
                  striped && colIndex % 2 === 1 && 'data-[odd=true]:true',
                )}
                data-odd={striped && colIndex % 2 === 1}
                role="row"
              >
                <td className={tdClass}>{column.title || column.key}</td>
                <td className={tdClass}>{renderCellValue(column, dataItem, dataIndex)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ))}
    </div>
  );
}
