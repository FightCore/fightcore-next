import { Hitbox } from "@/models/hitbox";
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

export default function HitboxTable(params: Readonly<HitboxTableParams>) {
  const classNames = React.useMemo(
    () => ({
      wrapper: ["dark:bg-gray-800", "shadow-none"],
      th: ["bg-transparent"],
    }),
    []
  );
  return (
    <>
      <div className="hidden md:block">
        <Table classNames={classNames} aria-label="Table of hitbox statistics">
          <TableHeader>
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
            {params.hitboxes.map((hitbox) => (
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
      <div className="block md:hidden">
        <Table classNames={classNames} aria-label="Table of hitbox statistics">
          {MobileHitboxHeader(params.hitboxes)}
          <TableBody>
            {MobileHitboxRow(params.hitboxes, "damage", "Damage")}
            {MobileHitboxRow(params.hitboxes, "angle", "Angle")}
            {MobileHitboxRow(params.hitboxes, "knockbackGrowth", "Knockback Growth")}
            {MobileHitboxRow(params.hitboxes, "baseKnockback", "Base Knockback")}
            {MobileHitboxRow(params.hitboxes, "setKnockback", "Set Knockback")}
            {MobileHitboxRow(params.hitboxes, "effect", "Effect")}
            {MobileHitboxRow(params.hitboxes, "hitlagAttacker", "Hitlag attacker")}
            {MobileHitboxRow(params.hitboxes, "hitlagDefender", "Hitlag defender")}
            {MobileHitboxRow(params.hitboxes, "shieldstun", "Shieldstun")}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
