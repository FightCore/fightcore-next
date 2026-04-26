import { DataTable } from '@/components/ui/data-table/data-table';
import { CharacterBase } from '@/models/character';
import { Card } from '@heroui/react';
import Image from 'next/image';
import NextLink from 'next/link';
import React from 'react';

interface CharacterCardInput {
  character: CharacterBase;
}

export const CharacterCard = (input: CharacterCardInput) => {
  const character = input.character;
  const classNames = React.useMemo(
    () => ({
      wrapper: ['border-0', 'shadow-none', 'p-0'],
      th: ['bg-transparent!', 'text-default-500', 'border-b', 'border-divider'],
      td: ['text-default-600', 'py-1'],
    }),
    [],
  );
  return (
    <Card.Root key={character.normalizedName} className="w-full md:max-w-85 dark:bg-card">
      <Card.Header className="justify-between">
        <div className="mt-3 ml-3 flex gap-3">
          <Image
            width={40}
            height={40}
            alt={character.normalizedName}
            src={'/newicons/' + character.name + '.webp'}
            loading={'eager'}
          />
          <div className="flex flex-col items-start justify-center gap-1">
            <h4 className="text-default-600 text-lg leading-none font-bold">{character.name}</h4>
          </div>
        </div>
      </Card.Header>
      <Card.Content className="text-small text-default-400 px-3 py-0">
        <DataTable
          data={[
            { name: 'Weight', value: character.characterStatistics.weight },
            { name: 'Gravity', value: character.characterStatistics.gravity },
            { name: 'Walk Speed', value: character.characterStatistics.walkSpeed },
            { name: 'Run Speed', value: character.characterStatistics.runSpeed },
            { name: 'Wave Dash Length Rank', value: character.characterStatistics.waveDashLengthRank },
            { name: 'Initial Dash', value: character.characterStatistics.initialDash },
            { name: 'Dash frames', value: character.characterStatistics.dashFrames },
            { name: 'Jump Squat', value: character.characterStatistics.jumpSquat },
            { name: 'Can Wall Jump', value: character.characterStatistics.canWallJump ? 'Yes' : 'No' },
          ]}
          columns={[
            { key: 'name', title: 'Name' },
            { key: 'value', title: 'Value', align: 'right', monospace: true },
          ]}
          rowKeyField="name"
          classNames={classNames}
          ariaLabel="Character statistics"
          ignoreMobileTable
        />
      </Card.Content>
      <Card.Footer className="gap-3">
        <NextLink
          href={'/characters/' + character.fightCoreId + '/' + character.normalizedName}
          className="text-medium inline-flex w-full items-center justify-center rounded-lg bg-brand px-4 py-2 font-bold text-white hover:bg-brand-light"
        >
          View
        </NextLink>
      </Card.Footer>
    </Card.Root>
  );
};
