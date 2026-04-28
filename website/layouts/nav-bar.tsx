import { GlobalSearch } from '@/components/global-search/global-search';
import { useGlobalSearch } from '@/components/global-search/global-search-context';
import { characters } from '@/config/framedata/framedata';
import { VERSION_NUMBER } from '@/layouts/version-number';
import { characterRoute } from '@/utilities/routes';
import { Tooltip } from '@heroui/react';
import Image from 'next/image';
import NextLink from 'next/link';
import React, { useEffect } from 'react';
import {
  FaAward,
  FaBars,
  FaCalculator,
  FaCircleUser,
  FaGoogleDrive,
  FaMugHot,
  FaRobot,
  FaXmark,
} from 'react-icons/fa6';
import { Logo } from '../components/icons';
import { Socials } from './socials';

export const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { registerNavigateCallback } = useGlobalSearch();

  const closeMenu = () => setIsMenuOpen(false);

  // Close the nav menu when a search result is clicked
  useEffect(() => {
    return registerNavigateCallback(closeMenu);
  }, [registerNavigateCallback]);

  return (
    <>
      <nav className="flex h-16 w-full items-center bg-accent px-4 dark:bg-background">
        <button
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          className="mr-3 text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <FaXmark size={20} /> : <FaBars size={20} />}
        </button>
        <NextLink href="/" onClick={closeMenu}>
          <Logo height={50} width={200} />
        </NextLink>
        {process.env.IS_BETA ? <p className="ml-2 text-white">Beta</p> : null}
      </nav>

      {isMenuOpen && (
        <div className="fixed top-16 right-0 left-0 z-50 mt-0 max-h-[calc(100vh-4rem)] space-y-1 overflow-y-auto bg-surface px-7 pb-7 shadow-lg">
          <div className="pt-3">
            <GlobalSearch />
          </div>

          <NextLink
            href="/"
            className="group flex items-center rounded-lg p-2 text-foreground hover:bg-surface-secondary"
            onClick={closeMenu}
          >
            <FaCircleUser />
            <span className="ms-3">Characters</span>
          </NextLink>

          <NextLink
            href="/crouch-cancel-calculator"
            className="group flex items-center rounded-lg p-2 text-foreground hover:bg-surface-secondary"
            onClick={closeMenu}
          >
            <FaCalculator />
            <span className="ms-3">Crouch Cancel Calculator</span>
          </NextLink>

          <a
            href="https://bot.fightcore.gg"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center rounded-lg p-2 text-foreground hover:bg-surface-secondary"
            onClick={closeMenu}
          >
            <FaRobot />
            <span className="ms-3">Discord Bot</span>
          </a>

          <a
            href="https://drive.fightcore.gg"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center rounded-lg p-2 text-foreground hover:bg-surface-secondary"
            onClick={closeMenu}
          >
            <FaGoogleDrive />
            <span className="ms-3">Drive</span>
          </a>

          <NextLink
            href="/credits"
            className="group flex items-center rounded-lg p-2 text-foreground hover:bg-surface-secondary"
            onClick={closeMenu}
          >
            <FaAward />
            <span className="ms-3">Credits & Sources</span>
          </NextLink>

          <a
            href="https://ko-fi.com/fc_bort"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center rounded-lg p-2 text-foreground hover:bg-surface-secondary"
            onClick={closeMenu}
          >
            <FaMugHot />
            <span className="ms-3">Buy me a coffee</span>
          </a>

          <div className="py-2">
            <hr className="border-border" />
          </div>

          <div className="flex w-full flex-row flex-wrap justify-start gap-5">
            {characters.map((character) => (
              <div key={character.normalizedName}>
                <Tooltip delay={1000}>
                  <Tooltip.Trigger>
                    <NextLink href={characterRoute(character)} onClick={closeMenu}>
                      <Image
                        className="grow text-white"
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
          </div>

          <div className="flex h-full flex-row pb-7">
            <div className="w-full self-end">
              <Socials />
              <NextLink className="mt-2" href="/patchnotes" onClick={closeMenu}>
                Version {VERSION_NUMBER}
              </NextLink>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
