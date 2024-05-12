import React from 'react';
import {
  Image,
  Card,
  CardHeader,
  Button,
  CardBody,
  CardFooter,
  Table,
  TableHeader,
  TableColumn,
  TableRow,
  TableCell,
  TableBody,
  Link,
} from '@nextui-org/react';

interface CharacterCardInput {
  character: any;
}

export const CharacterCard = (input: CharacterCardInput) => {
  const character = input.character;
  const classNames = React.useMemo(
    () => ({
      wrapper: ['dark:bg-gray-800', 'border-0', 'shadow-none', 'p-0'],
      th: ['bg-transparent', 'text-default-500', 'border-b', 'border-divider'],
      td: ['text-default-600', 'py-1'],
    }),
    []
  );
  return (
    <Card
      key={character.normalizedName}
      className='max-w-[340px] dark:bg-gray-800'
    >
      <CardHeader className='justify-between'>
        <div className='flex gap-5'>
          <Image
            width={40}
            alt={character.normalizedName}
            src={'/newicons/' + character.name + '.webp'}
            loading={'eager'}
          />
          <div className='flex flex-col gap-1 items-start justify-center'>
            <h4 className='text-medium font-semibold leading-none text-default-600'>
              {character.name}
            </h4>
          </div>
        </div>
      </CardHeader>
      <CardBody className='px-3 py-0 text-small text-default-400'>
        <Table
          classNames={classNames}
          key={character.normalizedName}
          aria-label='Example static collection table'
        >
          <TableHeader>
            <TableColumn key={'col1' + character.normalizedName}>
              NAME
            </TableColumn>
            <TableColumn key={'col2' + character.normalizedName}>
              VALUE
            </TableColumn>
          </TableHeader>
          <TableBody>
            <TableRow key={'1' + character.normalizedName}>
              <TableCell>Weight</TableCell>
              <TableCell>{character.characterStatistics.weight}</TableCell>
            </TableRow>
            <TableRow key={'2' + character.normalizedName}>
              <TableCell>Gravity</TableCell>
              <TableCell>{character.characterStatistics.gravity}</TableCell>
            </TableRow>
            <TableRow key={'3' + character.normalizedName}>
              <TableCell>Walk Speed</TableCell>
              <TableCell>{character.characterStatistics.walkSpeed}</TableCell>
            </TableRow>
            <TableRow key={'4' + character.normalizedName}>
              <TableCell>Run Speed</TableCell>
              <TableCell>{character.characterStatistics.runSpeed}</TableCell>
            </TableRow>
            <TableRow key={'5' + character.normalizedName}>
              <TableCell>Wave Dash Lenght Rank</TableCell>
              <TableCell>
                {character.characterStatistics.waveDashLengthRank}
              </TableCell>
            </TableRow>
            <TableRow key={'6' + character.normalizedName}>
              <TableCell>Initial Dash</TableCell>
              <TableCell>{character.characterStatistics.initialDash}</TableCell>
            </TableRow>
            <TableRow key={'7' + character.normalizedName}>
              <TableCell>Dash frames</TableCell>
              <TableCell>{character.characterStatistics.dashFrames}</TableCell>
            </TableRow>
            <TableRow key={'8' + character.normalizedName}>
              <TableCell>Jump Squat</TableCell>
              <TableCell>{character.characterStatistics.jumpSquat}</TableCell>
            </TableRow>
            <TableRow key={'9' + character.normalizedName}>
              <TableCell>Can wall jump</TableCell>
              <TableCell>{character.characterStatistics.canWallJump}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardBody>
      <CardFooter className='gap-3'>
        <Button
          href={'/characters/' + encodeURIComponent(character.normalizedName)}
          as={Link}
          className='w-full dark:hover:bg-red-600'
        >
          View
        </Button>
      </CardFooter>
    </Card>
  );
};
