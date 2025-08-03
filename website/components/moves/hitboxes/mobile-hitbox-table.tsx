import { Hitbox } from '@/models/hitbox';
import { getMappedUnique } from '@/utilities/utils';
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/table';
import { Tab, Tabs } from '@heroui/tabs';
import { FlattenedHitbox } from './hitbox-table-columns';

function MobileHitboxHeader(hitboxes: Readonly<Hitbox[]>) {
  const cells = [<TableColumn key="name-key">Name</TableColumn>];
  cells.push(...hitboxes.map((hitbox) => <TableColumn key={'id' + hitbox.id}>{hitbox.name}</TableColumn>));
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
    wrapper: ['dark:bg-gray-800', 'shadow-none'],
    th: ['bg-transparent'],
  };

  const hits = getMappedUnique(params.hitboxes, (hitbox) => hitbox.hit);

  const useCrouchedHitlag = params.hitboxes.some(
    (hitbox) =>
      hitbox.hitlagAttacker !== hitbox.hitlagAttackerCrouched ||
      hitbox.hitlagDefender !== hitbox.hitlagDefenderCrouched,
  );

  const tableRows: { key: keyof Hitbox; title: string }[] = [
    { key: 'damage', title: 'Damage' },
    { key: 'angle', title: 'Angle' },
    { key: 'knockbackGrowth', title: 'Knockback Growth' },
    { key: 'setKnockback', title: 'Set Knockback' },
    { key: 'baseKnockback', title: 'Base Knockback' },
    { key: 'effect', title: 'Effect' },
    { key: 'hitlagAttacker', title: 'Hitlag Attacker' },
    { key: 'hitlagDefender', title: 'Hitlag Defender' },
  ];

  if (useCrouchedHitlag) {
    tableRows.push({ key: 'hitlagAttackerCrouched', title: 'Crouched Hitlag Attacker' });
    tableRows.push({ key: 'hitlagDefenderCrouched', title: 'Crouched Hitlag Defender' });
  }

  tableRows.push({ key: 'shieldstun', title: 'Shieldstun' });

  return (
    <div>
      <Tabs disableAnimation placement="top" className="w-max max-w-full overflow-x-scroll">
        {hits.map((hit) => {
          const hitboxes = params.hitboxes.filter((hitbox) => hitbox.hit === hit);
          const hitObjects = hitboxes[0].hitObjects;
          const minStart = Math.min(...hitObjects.map((hitbox) => hitbox.start));
          const maxEnd = Math.max(...hitObjects.map((hitbox) => hitbox.end));
          let title = hit;
          if (minStart !== 0 && maxEnd !== 0) {
            title = minStart + ' - ' + maxEnd;
          }

          return (
            <Tab key={'hit' + hit} title={title}>
              <Table classNames={classNames} aria-label="Table of hitbox statistics">
                {MobileHitboxHeader(hitboxes)}
                <TableBody>{tableRows.map((row) => MobileHitboxRow(hitboxes, row.key, row.title))}</TableBody>
              </Table>
            </Tab>
          );
        })}
      </Tabs>
    </div>
  );
}
