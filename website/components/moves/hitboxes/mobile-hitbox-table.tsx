import { Hitbox } from '@/models/hitbox';
import { getMappedUnique } from '@/utilities/utils';
import { Table, Tabs } from '@heroui/react';
import { FlattenedHitbox } from './hitbox-table-columns';

function MobileHitboxHeader(hitboxes: Readonly<Hitbox[]>) {
  const cells = [<Table.Column key="name-key">Name</Table.Column>];
  cells.push(...hitboxes.map((hitbox) => <Table.Column key={'id' + hitbox.id}>{hitbox.name}</Table.Column>));
  return <Table.Header>{cells}</Table.Header>;
}

function MobileHitboxRow(hitboxes: Hitbox[], accessor: keyof Hitbox, title: string) {
  const key = accessor.toString();
  // NextJs/React can't handle having a static element and some dynamic elements together
  // Because of this, we have to create an array with the static value and then push the other elements.
  // This is the best way I've found to do this, this is only a typing issue as the code compiles fine.
  const cells = [<Table.Cell key={key}>{title}</Table.Cell>];
  cells.push(...hitboxes.map((hitbox) => <Table.Cell key={key + hitbox.id}>{hitbox[accessor]}</Table.Cell>));
  return <Table.Row key={key}>{cells}</Table.Row>;
}

export interface MobileHitboxTableParams {
  hitboxes: FlattenedHitbox[];
}

export default function MobileHitboxTable(params: MobileHitboxTableParams) {
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

  const hitData = hits.map((hit) => {
    const hitboxes = params.hitboxes.filter((hitbox) => hitbox.hit === hit);
    const hitObjects = hitboxes[0].hitObjects;
    const minStart = Math.min(...hitObjects.map((hitbox) => hitbox.start));
    const maxEnd = Math.max(...hitObjects.map((hitbox) => hitbox.end));
    let title = hit;
    if (minStart !== 0 && maxEnd !== 0) {
      title = minStart + ' - ' + maxEnd;
    }
    return { hit, hitboxes, title };
  });

  return (
    <div>
      <Tabs.Root className="w-max max-w-full overflow-x-scroll">
        <Tabs.ListContainer>
          <Tabs.List>
            {hitData.map(({ hit, title }) => (
              <Tabs.Tab key={'hit' + hit} id={'hit' + hit}>
                {title}
              </Tabs.Tab>
            ))}
          </Tabs.List>
        </Tabs.ListContainer>
        {hitData.map(({ hit, hitboxes }) => (
          <Tabs.Panel key={'hit' + hit} id={'hit' + hit}>
            <Table.Root className="shadow-none dark:bg-gray-800" aria-label="Table of hitbox statistics">
              {MobileHitboxHeader(hitboxes)}
              <Table.Body>{tableRows.map((row) => MobileHitboxRow(hitboxes, row.key, row.title))}</Table.Body>
            </Table.Root>
          </Tabs.Panel>
        ))}
      </Tabs.Root>
    </div>
  );
}
