'use client';
import { characters } from '@/config/framedata/framedata';
import { VERSION_NUMBER } from '@/layouts/version-number';
import { characterRoute } from '@/utilities/routes';
import Image from 'next/image';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';

interface SideNavProps {
  isCollapsed: boolean;
}

export function SideNav({ isCollapsed }: SideNavProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto px-1.5 py-3">
        {characters.map((character) => {
          const route = characterRoute(character);
          const isActive = pathname.startsWith(route);
          return (
            <NextLink
              key={character.normalizedName}
              href={route}
              className={`hover:bg-surface-secondary flex flex-row items-center gap-1.5 rounded-lg p-1 ${isCollapsed ? 'justify-center' : ''} ${isActive ? 'bg-surface-secondary' : ''}`}
            >
              <Image alt={character.name} width={30} height={30} src={'/newicons/' + character.name + '.webp'} />
              {!isCollapsed && (
                <span className={`truncate text-sm ${isActive ? 'text-foreground font-medium' : 'text-muted'}`}>
                  {character.name}
                </span>
              )}
            </NextLink>
          );
        })}
      </div>
      {isCollapsed ? (
        <></>
      ) : (
        <div className="border-border flex flex-col border-t px-3 py-2">
          <span className="text-muted text-xs">Made by Bort</span>
          <NextLink href="/patchnotes" className="text-muted hover:text-foreground text-xs">
            Version {VERSION_NUMBER}
          </NextLink>
        </div>
      )}
    </div>
  );
}
