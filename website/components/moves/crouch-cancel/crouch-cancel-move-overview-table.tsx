import { CharacterBase } from "@/models/character";
import { Move } from "@/models/move";
import { calculateCrouchCancelPercentage } from "@/utilities/crouch-cancel-calculator";
import { moveRoute } from "@/utilities/routes";
import { Link } from "@nextui-org/link";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/table";

export interface CrouchCancelMoveOverviewTableParams {
  character: CharacterBase;
  target: CharacterBase;
  moves: Move[];
  knockbackTarget: number;
  floorPercentage: boolean;
}

export function CrouchCancelMoveOverviewTable(data: Readonly<CrouchCancelMoveOverviewTableParams>) {
  const classNames = {
    wrapper: ["dark:bg-gray-800", "border-0", "shadow-none", "p-0"],
    th: ["bg-transparent", "text-default-500", "border-b", "border-divider"],
    td: ["text-default-600", "py-1", "group-data-[odd=true]:before:dark:bg-gray-700"],
  };

  return (
    <h2>This component has been temporarily disabled due to the hitbox rework. Please visit the main website.</h2>
    // <Table classNames={classNames} isStriped>
    //   <TableHeader>
    //     <TableColumn>Name</TableColumn>
    //     <TableColumn>Hitbox</TableColumn>
    //     <TableColumn>Breaks at percentage</TableColumn>
    //   </TableHeader>
    //   <TableBody>
    //     {data.moves
    //       .filter((move) => move.hits && move.hits.length > 0)
    //       .map((move) => {
    //         return (
    //           <TableRow key={move.id.toString()}>
    //             <TableCell>
    //               <Link href={moveRoute(data.character, move)}>{move.name}</Link>
    //             </TableCell>
    //             <TableCell>
    //               {move.hitboxes?.map((hitbox) => (
    //                 <div key={hitbox.id.toString() + "name"}>{hitbox.name}</div>
    //               ))}
    //             </TableCell>
    //             <TableCell>
    //               {move.hitboxes?.map((hitbox) => (
    //                 <div key={hitbox.id + "percentage"}>
    // eslint-disable-next-line max-len
    //                   {calculateCrouchCancelPercentage(hitbox, data.target, data.knockbackTarget, data.floorPercentage)}
    //                 </div>
    //               ))}
    //             </TableCell>
    //           </TableRow>
    //         );
    //       })}
    //   </TableBody>
    // </Table>
  );
}
