import { CharacterBase } from '@/models/character';
import { Hitbox } from '@/models/hitbox';
import { Move } from '@/models/move';
import {
  calculateCrouchCancelPercentage,
  getCrouchCancelImpossibleReason,
  isCrouchCancelPossible,
} from '@/utilities/crouch-cancel-calculator';
import { processDuplicateHitboxes, processDuplicateHits } from '@/utilities/hitbox-utils';
import { moveRoute } from '@/utilities/routes';
import { Link } from '@nextui-org/link';
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/table';
import { flattenData } from '../hitboxes/hitbox-table-columns';

export interface CrouchCancelMoveOverviewTableParams {
  character: CharacterBase;
  target: CharacterBase;
  moves: Move[];
  knockbackTarget: number;
  floorPercentage: boolean;
}

function generateHitboxPercentage(hitbox: Hitbox, target: CharacterBase, knockbackTarget: number, floor: boolean) {
  if (!isCrouchCancelPossible(hitbox)) {
    return getCrouchCancelImpossibleReason(hitbox);
  }

  return calculateCrouchCancelPercentage(hitbox, target, knockbackTarget, floor, false);
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

  let previousName = '';

  return (
    <Table classNames={classNames} isStriped>
      <TableHeader>
        <TableColumn>Name</TableColumn>
        <TableColumn>Hit</TableColumn>
        <TableColumn>Hitbox</TableColumn>
        <TableColumn>Breaks at percentage</TableColumn>
      </TableHeader>
      <TableBody>
        {flattenedHits.map((hitbox) => {
          const html = (
            <TableRow key={hitbox.id.toString()}>
              <TableCell>
                {previousName === hitbox.move.name ? (
                  ''
                ) : (
                  <Link href={moveRoute(params.character, hitbox.move)}>{hitbox.move.name}</Link>
                )}
              </TableCell>
              <TableCell width={100} className="md:text-center">
                {hitbox.hit}
              </TableCell>
              <TableCell>{hitbox.name}</TableCell>
              <TableCell className="md:text-center">
                {generateHitboxPercentage(hitbox, params.target, params.knockbackTarget, params.floorPercentage)}
              </TableCell>
            </TableRow>
          );

          previousName = hitbox.move.name;
          return html;
        })}
      </TableBody>
    </Table>
  );
}
