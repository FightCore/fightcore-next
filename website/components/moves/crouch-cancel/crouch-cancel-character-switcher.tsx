import { characters } from '@/config/framedata/framedata';
import { crouchCancelCharacterRoute } from '@/utilities/routes';
import { Tooltip } from '@heroui/react';
import Image from 'next/image';
import NextLink from 'next/link';

export default function CrouchCancelCharacterSwitches() {
  return (
    <>
      {characters.map((character) => (
        <div key={character.normalizedName}>
          <Tooltip delay={1000}>
            <Tooltip.Trigger>
              <NextLink href={crouchCancelCharacterRoute(character)}>
                <Image
                  className="grow"
                  alt={character.name}
                  width={40}
                  height={40}
                  src={'/newicons/' + character.name + '.webp'}
                />
              </NextLink>
            </Tooltip.Trigger>
            <Tooltip.Content>{character.name}</Tooltip.Content>
          </Tooltip>
        </div>
      ))}
    </>
  );
}
