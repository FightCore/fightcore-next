import { Hitbox } from "@/models/hitbox";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/table";
import { FlattenedHitbox } from "./hitbox-table-columns";
import { Tabs, Tab } from "@nextui-org/tabs";
import { getMappedUnique } from "@/utilities/utils";

function MobileHitboxHeader(hitboxes: Readonly<Hitbox[]>) {
  const cells = [<TableColumn key="name-key">Name</TableColumn>];
  cells.push(...hitboxes.map((hitbox) => <TableColumn key={"id" + hitbox.id}>{hitbox.name}</TableColumn>));
  return <TableHeader>{cells}</TableHeader>;
}

function MobileHitboxRow(hitboxes: Hitbox[], accessor: keyof Hitbox, title: string) {
  const key = accessor.toString();
  // NextJs/React can't handle having a static element and some dynamic elements together
  // Because of this, we have to create an array with the static value and then push the other elements.
  // This is the best way I've found to do this, this is only a typing issue as the code compiles fine.

  const cells = [<TableCell key={key}>{title}</TableCell>];
  cells.push(...hitboxes.map((hitbox) => <TableCell key={key + hitbox.id}>{hitbox[accessor]}</TableCell>));
  return <TableRow key={key}>{cells}</TableRow>;
}

export interface MobileHitboxTableParams {
  hitboxes: FlattenedHitbox[];
}

export default function MobileHitboxTable(params: MobileHitboxTableParams) {
  const classNames = {
    wrapper: ["dark:bg-gray-800", "shadow-none"],
    th: ["bg-transparent"],
  };

  const hits = getMappedUnique(params.hitboxes, (hitbox) => hitbox.hit);
  return (
    <div>
      <Tabs disableAnimation placement="top" className="max-w-full w-max overflow-x-scroll">
        {hits.map((hit) => {
          const hitboxes = params.hitboxes.filter((hitbox) => hitbox.hit === hit);
          return (
            <Tab key={hit} title={hit}>
              <Table classNames={classNames} aria-label="Table of hitbox statistics">
                {MobileHitboxHeader(hitboxes)}
                <TableBody>
                  {MobileHitboxRow(hitboxes, "damage", "Damage")}
                  {MobileHitboxRow(hitboxes, "angle", "Angle")}
                  {MobileHitboxRow(hitboxes, "knockbackGrowth", "Knockback Growth")}
                  {MobileHitboxRow(hitboxes, "baseKnockback", "Base Knockback")}
                  {MobileHitboxRow(hitboxes, "setKnockback", "Set Knockback")}
                  {MobileHitboxRow(hitboxes, "effect", "Effect")}
                  {MobileHitboxRow(hitboxes, "hitlagAttacker", "Hitlag attacker")}
                  {MobileHitboxRow(hitboxes, "hitlagDefender", "Hitlag defender")}
                  {MobileHitboxRow(hitboxes, "shieldstun", "Shieldstun")}
                </TableBody>
              </Table>
            </Tab>
          );
        })}
      </Tabs>
    </div>
  );
}
