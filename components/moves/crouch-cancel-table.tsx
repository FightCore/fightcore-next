import { Hitbox } from '@/models/hitbox';
import { characters } from '@/config/framedata/framedata';
import {
  Tabs,
  Tab,
  Card,
  CardHeader,
  CardBody,
  Image,
} from '@nextui-org/react';

export interface CrouchCancelTableParams {
  hitboxes: Hitbox[];
}

function GenerateCard(knockbackTarget: number, title: string, hitbox: Hitbox) {
  return (
    <div className='w-1/2 p-2'>
      <Card className='dark:bg-gray-800'>
        <CardHeader>{title}</CardHeader>
        <CardBody>
          <div className='grid grid-cols-5'>
            {characters.map((character) => {
              return (
                <div key={character.fightCoreId}>
                  <Image
                    alt={character.name}
                    width={40}
                    height={40}
                    src={'/newicons/' + character.name + '.webp'}
                  />
                  <span className='d-inline'>
                    {(
                      ((100 + character.characterStatistics.weight) / 14) *
                        (((100 / hitbox.knockbackGrowth) *
                          (knockbackTarget - hitbox.baseKnockback) -
                          18) /
                          (hitbox.damage + 2)) -
                      hitbox.damage
                    ).toFixed(2)}{' '}
                    %
                  </span>
                </div>
              );
            })}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export function CrouchCancelTable(params: Readonly<CrouchCancelTableParams>) {
  return (
    <Tabs aria-label='Dynamic tabs' items={params.hitboxes} disableAnimation>
      {(hitbox) => (
        <Tab key={hitbox.id} title={hitbox.name} className='flex'>
          {GenerateCard(80, 'ASDI Down', hitbox)}
          {GenerateCard(120, 'Crouch Cancel', hitbox)}
        </Tab>
      )}
    </Tabs>
  );
}
