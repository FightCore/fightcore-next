import CrouchCancelPercentageDisplay from '@/components/moves/crouch-cancel/crouch-cancel-percentage-display';
import { DataTable } from '@/components/ui/data-table/data-table';
import { CharacterBase } from '@/models/character';
import { DataTableColumn } from '@/models/data-table/data-table-column';
import { Move } from '@/models/move';
import { processDuplicateHitboxes, processDuplicateHits } from '@/utilities/hitbox-utils';
import { moveRoute } from '@/utilities/routes';
import { Link } from '@heroui/react';
import { flattenData } from '../hitboxes/hitbox-table-columns';

export interface CrouchCancelMoveOverviewTableParams {
  character: CharacterBase;
  target: CharacterBase;
  moves: Move[];
  knockbackTarget: number;
  floorPercentage: boolean;
  staleness: number;
}

export function CrouchCancelMoveOverviewTable(params: Readonly<CrouchCancelMoveOverviewTableParams>) {
  const classNames = {
    wrapper: ['dark:bg-gray-800', 'border-0', 'shadow-none', 'p-0'],
    th: ['bg-transparent', 'text-default-500', 'border-b', 'border-divider'],
    td: ['text-default-600', 'py-1', 'group-data-[odd=true]:before:dark:bg-gray-700'],
  };

  const flattenedHits = params.moves.flatMap((move) => {
    if (!move.hits || move.hits.length === 0) {
      return [];
    }

    const processedHits = processDuplicateHitboxes(move.hits!);
    const data = processDuplicateHits(flattenData(processedHits));
    return data.map((hitbox) => ({
      ...hitbox,
      move: move,
    }));
  });

  // Pre-process data to add showName flag for conditional rendering
  let previousName = '';
  const processedData = flattenedHits.map((hitbox) => {
    const showName = previousName !== hitbox.move.name;
    previousName = hitbox.move.name;
    return { ...hitbox, showName };
  });

  const columns: DataTableColumn<(typeof processedData)[0]>[] = [
    { key: 'hit', title: 'Hit', width: 100, align: 'center' },
    { key: 'name', title: 'Hitbox' },
    {
      key: 'percentage',
      title: 'Breaks at percentage',
      align: 'center',
      render: (_, row) => (
        <CrouchCancelPercentageDisplay
          hitbox={row}
          floor={params.floorPercentage}
          knockbackTarget={params.knockbackTarget}
          staleness={params.staleness}
          target={params.target}
        />
      ),
    },
  ];

  return (
    <DataTable
      data={processedData}
      columns={columns}
      rowKeyField="id"
      striped={true}
      classNames={classNames}
      groupBy={{
        accessor: (row) => row.move.name,
        renderGroupHeader: (groupKey, groupItems) => {
          return <Link href={moveRoute(params.character, groupItems[0].move)}>{groupKey}</Link>;
        },
      }}
    />
  );
}
