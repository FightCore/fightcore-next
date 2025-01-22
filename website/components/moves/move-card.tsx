import { CharacterBase } from '@/models/character';
import { Move } from '@/models/move';
import { moveRoute } from '@/utilities/routes';
import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Link } from "@heroui/link";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/table";
import React from 'react';
import { PreviewVideo } from './animations/preview-video';

interface MoveCardParams {
  move: Move;
  character: CharacterBase;
  lazy: boolean;
}

export const MoveCard = (params: MoveCardParams) => {
  const classNames = React.useMemo(
    () => ({
      td: ['text-default-600'],
    }),
    [],
  );
  const stats: [string, keyof Move][] = [
    ['Auto Cancel Before', 'autoCancelBefore'],
    ['Auto Cancel After', 'autoCancelAfter'],
    ['IASA', 'iasa'],
    ['L-Canceled Land Lag', 'lCanceledLandLag'],
    ['Land Lag', 'landLag'],
    ['Landing Fall Special Lag', 'landingFallSpecialLag'],
    ['Notes', 'notes'],
  ];

  return (
    <>
      <Card key={params.move.normalizedName} className="w-full dark:bg-gray-800">
        <CardHeader className="justify-between">
          <div className="flex gap-5">
            <div className="flex flex-col items-start justify-center gap-1">
              <h4 className="text-lg font-semibold leading-none text-default-600">{params.move.name}</h4>
            </div>
          </div>
        </CardHeader>
        <CardBody className="px-3 py-0 text-small text-default-400">
          <PreviewVideo move={params.move} characterName={params.character.name} lazy={params.move.type !== 2} />
          <div className="mt-2 grid grid-cols-3 gap-2">
            <div className="rounded-lg bg-red-700 p-2 text-center text-white">
              <h2 className="text-xl font-semibold">Start</h2>
              <p>{params.move.start}</p>
            </div>
            <div className="rounded-lg bg-red-700 p-2 text-center text-white">
              <h2 className="text-xl font-semibold">End</h2>
              <p>{params.move.end}</p>
            </div>
            <div className="rounded-lg bg-red-700 p-2 text-center text-white">
              <h2 className="text-xl font-semibold">Total</h2>
              <p>{params.move.totalFrames} frames</p>
            </div>
          </div>
          <Table
            hideHeader
            removeWrapper
            classNames={classNames}
            key={params.move.normalizedName}
            aria-label="Example static collection table"
          >
            <TableHeader>
              <TableColumn key={'col1' + params.move.normalizedName}>NAME</TableColumn>
              <TableColumn key={'col2' + params.move.normalizedName}>VALUE</TableColumn>
            </TableHeader>
            <TableBody>
              {stats
                .filter(([, key]) => params.move[key])
                .map(([name, key]) => (
                  <TableRow key={name}>
                    <TableCell>{name}</TableCell>
                    <TableCell>
                      <p className="text-right">{params.move[key]?.toString()}</p>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardBody>
        <CardFooter className="gap-3">
          <Button
            href={moveRoute(params.character, params.move)}
            as={Link}
            className="w-full bg-red-700 text-medium font-bold text-white hover:bg-red-500"
          >
            View
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};
