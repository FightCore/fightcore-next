import { DataTable } from '@/components/ui/data-table/data-table';
import { DataTableColumn } from '@/models/data-table/data-table-column';
import { Move } from '@/models/move';
import React from 'react';

export interface MoveTableParams {
  move: Move;
}

export default function MoveAttributeTable(params: Readonly<MoveTableParams>) {
  const columns: DataTableColumn<Move>[] = React.useMemo(
    () => [
      { key: 'start', title: 'Start', dataType: 'number' },
      { key: 'end', title: 'End', dataType: 'number' },
      { key: 'totalFrames', title: 'Total Frames', dataType: 'number' },
      { key: 'iasa', title: 'IASA', dataType: 'number' },
      { key: 'landLag', title: 'Land Lag', dataType: 'number' },
      { key: 'lCanceledLandLag', title: 'L-Canceled Land Lag', dataType: 'number' },
      { key: 'landingFallSpecialLag', title: 'Landing Fall Special Lag', dataType: 'number' },
      { key: 'autoCancelBefore', title: 'Auto Cancel Before', dataType: 'number' },
      { key: 'autoCancelAfter', title: 'Auto Cancel After', dataType: 'number' },
    ],
    [],
  );

  return (
    <DataTable
      data={[params.move]}
      columns={columns}
      rowKeyField="id"
      ariaLabel="Table of move statistics"
    />
  );
}
