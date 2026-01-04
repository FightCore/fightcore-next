import { DataTable } from '@/components/ui/data-table/data-table';
import { DataTableColumn } from '@/models/data-table/data-table-column';
import { Hit } from '@/models/hit';
import { cloneObject } from '@/utilities/clone';
import {
  generateColors,
  getHitboxColor,
  processDuplicateHitboxes,
  processDuplicateHits,
} from '@/utilities/hitbox-utils';
import React from 'react';
import { flattenData, FlattenedHitbox } from './hitbox-table-columns';

export interface HitboxTableParams {
  hits: Hit[];
}

function getColorForHitbox(name: string): string | null {
  if (!name) {
    return null;
  }

  if (name.includes('id0')) {
    return 'bg-red-500';
  } else if (name.includes('id1')) {
    return 'bg-green-500';
  } else if (name.includes('id2')) {
    return 'bg-blue-300';
  } else if (name.includes('id3')) {
    return 'bg-purple-500';
  }

  return null;
}

export default function HitboxTable(params: Readonly<HitboxTableParams>) {
  const processedHits = processDuplicateHitboxes(params.hits);
  const data = processDuplicateHits(flattenData(processedHits));
  const mobileData = cloneObject(data);
  const colors = generateColors(data);

  const colorCache = new Map<string, string>();

  const columns: DataTableColumn<FlattenedHitbox>[] = React.useMemo(() => {
    const useCrouchedHitlag = data.some((hit) => hit.hitlagDefender !== hit.hitlagDefenderCrouched);

    return [
      { key: 'hit', title: 'Hit', dataType: 'string', width: 100 },
      {
        key: 'name',
        title: 'Name',
        dataType: 'string',
        width: 100,
        render: (value) => {
          const color = getColorForHitbox(value);
          if (!color) return value;
          return (
            <>
              <div className={`mr-1 inline-block h-3 w-3 border-1 border-black ${color}`} />
              {value}
            </>
          );
        },
      },
      { key: 'damage', title: 'Damage', dataType: 'number', width: 100 },
      { key: 'angle', title: 'Angle', dataType: 'number', width: 100 },
      { key: 'baseKnockback', title: 'Base Knockback', dataType: 'number', width: 100 },
      { key: 'knockbackGrowth', title: 'Knockback Growth', dataType: 'number', width: 100 },
      { key: 'setKnockback', title: 'Set Knockback', dataType: 'number', width: 100 },
      { key: 'effect', title: 'Effect', dataType: 'string', width: 100 },
      {
        key: 'hitlagAttacker',
        title: 'Hitlag Attacker',
        dataType: 'number',
        width: 100,
      },
      {
        key: 'hitlagDefender',
        title: 'Hitlag Defender',
        dataType: 'number',
        width: useCrouchedHitlag ? 150 : 100,
        render: (value, row) => {
          if (value !== row.hitlagDefenderCrouched) {
            return `${value} (${row.hitlagDefenderCrouched} Crouched)`;
          }
          return value;
        },
      },
      { key: 'shieldstun', title: 'Shieldstun', dataType: 'number', width: 100 },
    ];
  }, [data]);

  return (
    <DataTable
      data={data}
      columns={columns}
      rowKeyField="id"
      groupBy={{
        columnKey: 'hit',
        renderGroupHeader: (groupKey, groupItems) => {
          if (!colorCache.has(groupKey)) {
            const color = getHitboxColor(colors, groupItems[0].hitObjects[0].start);
            colorCache.set(groupKey, color!);
          }
          const color = colorCache.get(groupKey);
          if (!color) return groupKey;
          return (
            <>
              <div className={`mr-1 inline-block h-3 w-3 border-1 border-black ${color}`} />
              {groupKey}
            </>
          );
        },
      }}
      responsive={{ strategy: 'transpose' }}
      classNames={{}}
    />
  );
}
