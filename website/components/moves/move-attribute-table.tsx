import { Move } from '@/models/move';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/table';
import React from 'react';

export interface MoveTableParams {
  move: Move;
}

export default function MoveAttributeTable(params: Readonly<MoveTableParams>) {
  const classNames = React.useMemo(
    () => ({
      wrapper: ['dark:bg-gray-800', 'shadow-none'],
      th: ['bg-transparent'],
    }),
    [],
  );
  return (
    <>
      <div className="hidden md:block">
        <Table classNames={classNames} aria-label="Table of move statistics">
          <TableHeader>
            <TableColumn key="start">Start</TableColumn>
            <TableColumn key="end">End</TableColumn>
            <TableColumn key="total">Total Frames</TableColumn>
            <TableColumn key="iasa">IASA</TableColumn>
            <TableColumn key="landlag">Land Lag</TableColumn>
            <TableColumn key="lcancellandlag">L-Canceled Land Lag</TableColumn>
            <TableColumn key="landingFallSpecialLag">Landing Fall Special Lag</TableColumn>
            <TableColumn key="autocancelbefore">Auto Cancel Before</TableColumn>
            <TableColumn key="autocancelafter">Auto Cancel After</TableColumn>
          </TableHeader>
          <TableBody>
            <TableRow key={params.move.id}>
              <TableCell>{params.move.start}</TableCell>
              <TableCell>{params.move.end}</TableCell>
              <TableCell>{params.move.totalFrames}</TableCell>
              <TableCell>{params.move.iasa}</TableCell>
              <TableCell>{params.move.landLag}</TableCell>
              <TableCell>{params.move.lCanceledLandLag}</TableCell>
              <TableCell>{params.move.landingFallSpecialLag}</TableCell>
              <TableCell>{params.move.autoCancelBefore}</TableCell>
              <TableCell>{params.move.autoCancelAfter}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <div className="block md:hidden">
        <Table hideHeader classNames={classNames} aria-label="Table of move statistics">
          <TableHeader>
            <TableColumn key="name">Name</TableColumn>
            <TableColumn key="value">value</TableColumn>
          </TableHeader>
          <TableBody>
            <TableRow key="start">
              <TableCell key="start">Start</TableCell>
              <TableCell>{params.move.start}</TableCell>
            </TableRow>
            <TableRow key="end">
              <TableCell key="start">End</TableCell>
              <TableCell>{params.move.end}</TableCell>
            </TableRow>
            <TableRow key="total">
              <TableCell>Total</TableCell>
              <TableCell>{params.move.totalFrames}</TableCell>
            </TableRow>
            <TableRow key="iasa">
              <TableCell>IASA</TableCell>
              <TableCell>{params.move.iasa}</TableCell>
            </TableRow>
            <TableRow key="landlag">
              <TableCell>Land lag</TableCell>
              <TableCell>{params.move.landLag}</TableCell>
            </TableRow>
            <TableRow key="lcancellandlag">
              <TableCell>L-Canceled Land Lag</TableCell>
              <TableCell>{params.move.lCanceledLandLag}</TableCell>
            </TableRow>
            <TableRow key="landingfallspeciallag">
              <TableCell>Landing Fall Special Lag</TableCell>
              <TableCell>{params.move.landingFallSpecialLag}</TableCell>
            </TableRow>
            <TableRow key="autocancelbefore">
              <TableCell>Auto Cancel Before</TableCell>
              <TableCell>{params.move.autoCancelBefore}</TableCell>
            </TableRow>
            <TableRow key="autocancelafter">
              <TableCell>Auto Cancel After</TableCell>
              <TableCell>{params.move.autoCancelAfter}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </>
  );
}
