import { DataTable } from '@/components/ui/data-table/data-table';
import { CharacterBase } from '@/models/character';
import { Button } from '@heroui/button';
import { Card, CardBody, CardFooter, CardHeader } from '@heroui/card';
import { Image } from '@heroui/image';
import { Link } from '@heroui/link';
import React from 'react';

interface CharacterCardInput {
  character: CharacterBase;
}

export const CharacterCard = (input: CharacterCardInput) => {
  const character = input.character;
  const classNames = React.useMemo(
    () => ({
      wrapper: ['dark:bg-gray-800', 'border-0', 'shadow-none', 'p-0'],
      th: ['bg-transparent!', 'text-default-500', 'border-b', 'border-divider'],
      td: ['text-default-600', 'py-1'],
    }),
    [],
  );
  return (
    <Card key={character.normalizedName} className="w-full md:max-w-[340px] dark:bg-gray-800">
      <CardHeader className="justify-between">
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
      </CardHeader>
      <CardBody className="text-small text-default-400 px-3 py-0">
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
            { key: 'name', title: 'NAME' },
            { key: 'value', title: 'VALUE', align: 'right', monospace: true },
          ]}
          rowKeyField="name"
          classNames={classNames}
          ariaLabel="Character statistics"
        />
      </CardBody>
      <CardFooter className="gap-3">
        <Button
          href={'/characters/' + character.fightCoreId + '/' + character.normalizedName}
          as={Link}
          className="text-medium w-full bg-red-700 font-bold text-white hover:bg-red-500"
        >
          View
        </Button>
      </CardFooter>
    </Card>
  );
};
