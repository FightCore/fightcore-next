import { characters } from '@/config/framedata/framedata';
import { crouchCancelCharacterRoute } from '@/utilities/routes';
import { Image } from '@heroui/image';
import { Link } from '@heroui/link';
import { Tooltip } from '@heroui/tooltip';

export default function CrouchCancelCharacterSwitches() {
  return (
    <>
      {characters.map((character) => (
        <div key={character.normalizedName}>
          <Tooltip content={character.name} delay={1000}>
            <Link href={crouchCancelCharacterRoute(character)}>
              <Image
                className="grow"
                alt={character.name}
                width={40}
                height={40}
                src={'/newicons/' + character.name + '.webp'}
              />
            </Link>
          </Tooltip>
        </div>
      ))}
    </>
  );
}
