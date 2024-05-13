import { characters } from '@/config/framedata/framedata';
import { Character } from '@/models/character';
import { Move } from '@/models/move';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { promises as fs } from 'fs';
import { MoveGif } from '@/components/moves/move-gif';
import {
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Table,
} from '@nextui-org/react';
import React from 'react';

export type MovePage = {
  character: Character;
  Move: Move;
};

async function getCharacter(name: string): Promise<Character> {
  const fileName =
    process.cwd() + `/config/framedata/${name.replace('%26', '&')}.json`;
  const file = await fs.readFile(fileName, 'utf8');
  const character = JSON.parse(file) as Character;
  return character;
}

export async function getStaticPaths() {
  const moves = await Promise.all(
    characters.map(async (character) => {
      const enrichedCharacter = await getCharacter(character.normalizedName);
      return enrichedCharacter.moves.map((move) => ({
        characterName: character.normalizedName,
        moveName: move.normalizedName,
      }));
    })
  );

  const flattenedMoves = moves.flat();

  return {
    paths: flattenedMoves.map((move) => ({
      params: { characterName: move.characterName, moveName: move.moveName },
    })),
    fallback: false,
  };
}

export const getStaticProps = async (context: any) => {
  const fileName =
    process.cwd() +
    `/config/framedata/${(context?.params?.characterName as string).replace(
      '%26',
      '&'
    )}.json`;
  const file = await fs.readFile(fileName, 'utf8');
  const character = JSON.parse(file) as Character;

  if (!character) {
    return { notFound: true };
  }

  const move = character.moves.find(
    (move) => move.normalizedName === context?.params?.moveName
  );

  if (!move) {
    return { notFound: true };
  }

  return {
    props: {
      data: {
        character,
        move,
      },
    },
    revalidate: false,
  };
};

export default function MoveIndexPage({
  data,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const classNames = React.useMemo(
    () => ({
      wrapper: ['dark:bg-gray-800', 'shadow-none'],
      th: ['bg-transparent'],
      //td: ['text-default-600', 'py-1'],
    }),
    []
  );
  return (
    <>
      <div className='h-16 w-full bg-red-700 rounded-b-md border-b border-l border-r border-gray-700 flex justify-center items-center mb-2'>
        <p className='text-4xl font-extrabold text-center'>
          {data.move.name} - {data.character.name}
        </p>
      </div>
      <MoveGif move={data.move} characterName={data.character.normalizedName} />
      <div className='my-3'>
        <Table classNames={classNames}>
          <TableHeader>
            <TableColumn key='start'>Start</TableColumn>
            <TableColumn key='end'>End</TableColumn>
            <TableColumn key='total'>Total Frames</TableColumn>
            <TableColumn key='iasa'>IASA</TableColumn>
            <TableColumn key='lcancellandlag'>Land Lag</TableColumn>
            <TableColumn key='lcancellandlag'>L-Canceled Land Lag</TableColumn>
            <TableColumn key='landingFallSpecialLag'>
              Landing Fall Special Lag
            </TableColumn>
            <TableColumn key='autocancelbefore'>Auto Cancel Before</TableColumn>
            <TableColumn key='autocancelafter'>Auto Cancel After</TableColumn>
          </TableHeader>
          <TableBody>
            <TableRow key={data.move.id}>
              <TableCell>{data.move.start}</TableCell>
              <TableCell>{data.move.end}</TableCell>
              <TableCell>{data.move.totalFrames}</TableCell>
              <TableCell>{data.move.iasa}</TableCell>
              <TableCell>{data.move.landLag}</TableCell>
              <TableCell>{data.move.lCanceledLandLang}</TableCell>
              <TableCell>{data.move.landingFallSpecialLag}</TableCell>
              <TableCell>{data.move.autoCancelBefore}</TableCell>
              <TableCell>{data.move.autoCancelAfter}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div className='my-3'>
        <Table classNames={classNames}>
          <TableHeader>
            <TableColumn key='name'>Name</TableColumn>
            <TableColumn key='Damage'>Damage</TableColumn>
            <TableColumn key='Angle'>Angle</TableColumn>
            <TableColumn key='Knockback Growth'>Knockback Growth</TableColumn>
            <TableColumn key='BaseKnockback'>Base Knockback</TableColumn>
            <TableColumn key='SetKnockback'>Set Knockback</TableColumn>
            <TableColumn key='Effect'>Effect</TableColumn>
            <TableColumn key='Hitlag Attacker'>HitLag Attacker</TableColumn>
            <TableColumn key='Hitlag Defender'>Hitlag Defender</TableColumn>
            <TableColumn key='Shieldstun'>Shieldstun</TableColumn>
          </TableHeader>
          <TableBody>
            {data.move.hitboxes.map((hitbox) => (
              <TableRow key={hitbox.id}>
                <TableCell>{hitbox.name}</TableCell>
                <TableCell>{hitbox.damage}</TableCell>
                <TableCell>{hitbox.angle}</TableCell>
                <TableCell>{hitbox.knockbackGrowth}</TableCell>
                <TableCell>{hitbox.baseKnockback}</TableCell>
                <TableCell>{hitbox.setKnockback}</TableCell>
                <TableCell>{hitbox.effect}</TableCell>
                <TableCell>{hitbox.hitlagAttacker}</TableCell>
                <TableCell>{hitbox.hitlagDefender}</TableCell>
                <TableCell>{hitbox.shieldstun}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
