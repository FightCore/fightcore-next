import { CharacterBase } from '@/models/character';
import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Image } from "@heroui/image";
import { Link } from "@heroui/link";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/table";
import React from 'react';

interface CharacterCardInput {
  character: CharacterBase;
}

export const CharacterCard = (input: CharacterCardInput) => {
  const character = input.character;
  const classNames = React.useMemo(
    () => ({
      wrapper: ['dark:bg-gray-800', 'border-0', 'shadow-none', 'p-0'],
      th: ['bg-transparent', 'text-default-500', 'border-b', 'border-divider'],
      td: ['text-default-600', 'py-1'],
    }),
    [],
  );
  return (
    <Card key={character.normalizedName} className="w-full dark:bg-gray-800 md:max-w-[340px]">
      <CardHeader className="justify-between">
        <div className="ml-3 mt-3 flex gap-3">
          <Image
            width={40}
            height={40}
            alt={character.normalizedName}
            src={'/newicons/' + character.name + '.webp'}
            loading={'eager'}
          />
          <div className="flex flex-col items-start justify-center gap-1">
            <h4 className="text-lg font-bold leading-none text-default-600">{character.name}</h4>
          </div>
        </div>
      </CardHeader>
      <CardBody className="px-3 py-0 text-small text-default-400">
        <Table classNames={classNames} key={character.normalizedName} aria-label="Example static collection table">
          <TableHeader>
            <TableColumn key={'col1' + character.normalizedName}>NAME</TableColumn>
            <TableColumn className="text-right font-mono" key={'col2' + character.normalizedName}>
              VALUE
            </TableColumn>
          </TableHeader>
          <TableBody>
            <TableRow key={'1' + character.normalizedName}>
              <TableCell>Weight</TableCell>
              <TableCell className="text-right font-mono">{character.characterStatistics.weight}</TableCell>
            </TableRow>
            <TableRow key={'2' + character.normalizedName}>
              <TableCell>Gravity</TableCell>
              <TableCell className="text-right font-mono">{character.characterStatistics.gravity}</TableCell>
            </TableRow>
            <TableRow key={'3' + character.normalizedName}>
              <TableCell>Walk Speed</TableCell>
              <TableCell className="text-right font-mono">{character.characterStatistics.walkSpeed}</TableCell>
            </TableRow>
            <TableRow key={'4' + character.normalizedName}>
              <TableCell>Run Speed</TableCell>
              <TableCell className="text-right font-mono">{character.characterStatistics.runSpeed}</TableCell>
            </TableRow>
            <TableRow key={'5' + character.normalizedName}>
              <TableCell>Wave Dash Length Rank</TableCell>
              <TableCell className="text-right font-mono">{character.characterStatistics.waveDashLengthRank}</TableCell>
            </TableRow>
            <TableRow key={'6' + character.normalizedName}>
              <TableCell>Initial Dash</TableCell>
              <TableCell className="text-right font-mono">{character.characterStatistics.initialDash}</TableCell>
            </TableRow>
            <TableRow key={'7' + character.normalizedName}>
              <TableCell>Dash frames</TableCell>
              <TableCell className="text-right font-mono">{character.characterStatistics.dashFrames}</TableCell>
            </TableRow>
            <TableRow key={'8' + character.normalizedName}>
              <TableCell>Jump Squat</TableCell>
              <TableCell className="text-right font-mono">{character.characterStatistics.jumpSquat}</TableCell>
            </TableRow>
            <TableRow key={'9' + character.normalizedName}>
              <TableCell>Can Wall Jump</TableCell>
              <TableCell className="text-right font-mono">
                {character.characterStatistics.canWallJump ? 'Yes' : 'No'}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardBody>
      <CardFooter className="gap-3">
        <Button
          href={'/characters/' + character.fightCoreId + '/' + character.normalizedName}
          as={Link}
          className="w-full bg-red-700 text-medium font-bold text-white hover:bg-red-500"
        >
          View
        </Button>
      </CardFooter>
    </Card>
  );
};
