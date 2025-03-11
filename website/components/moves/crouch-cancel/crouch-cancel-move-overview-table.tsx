import CrouchCancelPercentageDisplay from '@/components/moves/crouch-cancel/crouch-cancel-percentage-display';
import { CharacterBase } from '@/models/character';
import { Move } from '@/models/move';
import { processDuplicateHitboxes, processDuplicateHits } from '@/utilities/hitbox-utils';
import { moveRoute } from '@/utilities/routes';
import { Link } from '@heroui/link';
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/table';
import { flattenData } from '../hitboxes/hitbox-table-columns';

export interface CrouchCancelMoveOverviewTableParams {
  character: CharacterBase;
  target: CharacterBase;
  moves: Move[];
  knockbackTarget: number;
  floorPercentage: boolean;
  staleness: number;
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
            <TableRow key={hitbox.id.toString() + '-' + params.staleness}>
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
              <TableCell className="md:text-center" key={params.staleness}>
                <CrouchCancelPercentageDisplay
                  hitbox={hitbox}
                  floor={params.floorPercentage}
                  knockbackTarget={params.knockbackTarget}
                  staleness={params.staleness}
                  target={params.target}
                ></CrouchCancelPercentageDisplay>
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
