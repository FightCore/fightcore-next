import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Link,
} from '@nextui-org/react';
import Image from 'next/image';
interface MoveCardParams {
  move: any;
  characterName: string;
  lazy: boolean;
}

export const MoveCard = (params: MoveCardParams) => {
  return (
    <Card
      key={params.move.normalizedName}
      className='max-w-[340px] dark:bg-gray-800'
    >
      <CardHeader className='justify-between'>
        <div className='flex gap-5'>
          <div className='flex flex-col gap-1 items-start justify-center'>
            <h4 className='text-medium font-semibold leading-none text-default-600'>
              {params.move.name}
            </h4>
          </div>
        </div>
      </CardHeader>
      <CardBody className='px-3 py-0 text-small text-default-400'>
        <video
          muted
          playsInline
          autoPlay
          loop
          width={500}
          height={300}
          src={
            'https://i.fightcore.gg/melee/moves/' +
            params.characterName +
            '/' +
            params.move.normalizedName +
            '.webm'
          }
        />
        {/* <Table
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
          <TableRow key={'5' + character.normalizedName}>
            <TableCell>Initial Dash</TableCell>
            <TableCell>{character.characterStatistics.initialDash}</TableCell>
          </TableRow>
          <TableRow key={'5' + character.normalizedName}>
            <TableCell>Dash frames</TableCell>
            <TableCell>{character.characterStatistics.dashFrames}</TableCell>
          </TableRow>
          <TableRow key={'5' + character.normalizedName}>
            <TableCell>Jump Squat</TableCell>
            <TableCell>{character.characterStatistics.jumpSquat}</TableCell>
          </TableRow>
          <TableRow key={'5' + character.normalizedName}>
            <TableCell>Can wall jump</TableCell>
            <TableCell>{character.characterStatistics.canWallJump}</TableCell>
          </TableRow>
        </TableBody>
      </Table> */}
      </CardBody>
      <CardFooter className='gap-3'>
        <Button
          href={
            '/characters/' +
            params.characterName +
            '/moves/' +
            params.move.normalizedName
          }
          as={Link}
          className='w-full dark:hover:bg-red-600'
        >
          View
        </Button>
      </CardFooter>
    </Card>
  );
};
