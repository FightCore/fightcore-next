import { Hitbox } from "@/models/hitbox";
import { areAllHitboxesEqual } from "@/utilities/hitbox-utils";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/table";
import React, { ReactElement } from "react";

export interface HitboxTableParams {
  hitboxes: Hitbox[];
}

function MobileHitboxRow(hitboxes: Hitbox[], accessor: keyof Hitbox, title: string): ReactElement {
  const key = accessor.toString();
  // NextJs/React can't handle having a static element and some dynamic elements together
  // Because of this, we have to create an array with the static value and then push the other elements.
  // This is the best way I've found to do this, this is only a typing issue as the code compiles fine.

  const cells = [<TableCell key={key}>{title}</TableCell>];
  cells.push(...hitboxes.map((hitbox) => <TableCell key={key + hitbox.id}>{hitbox[accessor]}</TableCell>));
  return <TableRow key={key}>{cells}</TableRow>;
}

function MobileHitboxHeader(hitboxes: Readonly<Hitbox[]>) {
  const cells = [<TableColumn key="name-key">Name</TableColumn>];
  cells.push(...hitboxes.map((hitbox) => <TableColumn key={"id" + hitbox.id}>{hitbox.name}</TableColumn>));
  return <TableHeader>{cells}</TableHeader>;
}

function getColorForHitbox(hitbox: Hitbox): string | null {
  if (!hitbox.name) {
    return null;
  }

  if (hitbox.name.includes("id0")) {
    return "bg-red-500";
  } else if (hitbox.name.includes("id1")) {
    return "bg-green-500";
  } else if (hitbox.name.includes("id2")) {
    return "bg-blue-300";
  } else if (hitbox.name.includes("id3")) {
    return "bg-purple-500";
  }

  return null;
}

export default function HitboxTable(params: Readonly<HitboxTableParams>) {
  const classNames = React.useMemo(
    () => ({
      wrapper: ["dark:bg-gray-800", "shadow-none"],
      th: ["bg-transparent"],
    }),
    []
  );

  let hitboxes = params.hitboxes;
  const allHitboxesEqual = areAllHitboxesEqual(params.hitboxes);
  if (allHitboxesEqual) {
    const newHitbox = structuredClone(params.hitboxes[0]);
    newHitbox.name = "All hitboxes";
    hitboxes = [newHitbox];
  }

  return (
    <>
      <div className="hidden md:block">
        <Table classNames={classNames} aria-label="Table of hitbox statistics">
          <TableHeader>
            <TableColumn key="hitbox color"> </TableColumn>
            <TableColumn key="name">Name</TableColumn>
            <TableColumn key="Damage">Damage</TableColumn>
            <TableColumn key="Angle">Angle</TableColumn>
            <TableColumn key="Knockback Growth">Knockback Growth</TableColumn>
            <TableColumn key="BaseKnockback">Base Knockback</TableColumn>
            <TableColumn key="SetKnockback">Set Knockback</TableColumn>
            <TableColumn key="Effect">Effect</TableColumn>
            <TableColumn key="Hitlag Attacker">HitLag Attacker</TableColumn>
            <TableColumn key="Hitlag Defender">Hitlag Defender</TableColumn>
            <TableColumn key="Shieldstun">Shieldstun</TableColumn>
          </TableHeader>
          <TableBody>
            {hitboxes.map((hitbox) => {
              const hitboxColor = getColorForHitbox(hitbox);
              return (
                <TableRow key={hitbox.id}>
                  <TableCell>
                    {hitboxColor && !allHitboxesEqual ? (
                      <div className={"w-3 h-3 " + hitboxColor + " rounded-full"}></div>
                    ) : (
                      <></>
                    )}
                  </TableCell>
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
              );
            })}
          </TableBody>
        </Table>
      </div>
      <div className="block md:hidden">
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
      </div>
    </>
  );
}
