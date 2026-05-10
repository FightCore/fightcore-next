'use client';
import { GlobalSearch } from '@/components/global-search/global-search';
import { useGlobalSearch } from '@/components/global-search/global-search-context';
import { ThemePicker } from '@/components/theme-picker';
import { ThemeSwitch } from '@/components/theme-switch';
import { characters } from '@/config/framedata/framedata';
import { siteConfig } from '@/config/site';
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
  FaDiscord,
  FaGithub,
  FaGoogleDrive,
  FaMugHot,
  FaRobot,
  FaXmark,
} from 'react-icons/fa6';
import { Logo } from '../components/icons';
import { Socials } from './socials';

const navLinks = [
  { href: '/characters', icon: <FaCircleUser />, label: 'Characters', external: false },
  { href: '/crouch-cancel-calculator', icon: <FaCalculator />, label: 'Crouch Cancel', external: false },
  { href: 'https://bot.fightcore.gg', icon: <FaRobot />, label: 'Discord Bot', external: true },
  { href: 'https://drive.fightcore.gg', icon: <FaGoogleDrive />, label: 'Drive', external: true },
  { href: '/credits', icon: <FaAward />, label: 'Credits', external: false },
  { href: 'https://ko-fi.com/fc_bort', icon: <FaMugHot />, label: 'Ko-fi', external: true },
];

const linkClass = 'flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-surface-secondary';

export const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { registerNavigateCallback } = useGlobalSearch();

  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    return registerNavigateCallback(closeMenu);
  }, [registerNavigateCallback]);

  return (
    <>
      <nav className="flex h-16 w-full items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <NextLink href="/" onClick={closeMenu}>
            <Logo height={50} width={200} />
          </NextLink>
          {process.env.IS_BETA ? <p className="text-foreground/60 text-sm">Beta</p> : null}
        </div>

        {/* Desktop: inline nav links */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) =>
            link.external ? (
              <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                {link.icon}
                {link.label}
              </a>
            ) : (
              <NextLink key={link.href} href={link.href} className={linkClass}>
                {link.icon}
                {link.label}
              </NextLink>
            ),
          )}
        </div>

        {/* Desktop: utilities */}
        <div className="hidden items-center gap-2 md:flex">
          <GlobalSearch />
          <a
            className="text-foreground"
            href={siteConfig.links.discord}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Discord"
          >
            <FaDiscord />
          </a>
          <a
            className="text-foreground"
            href={siteConfig.links.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Github"
          >
            <FaGithub />
          </a>
          <ThemePicker />
          <ThemeSwitch />
        </div>

        {/* Mobile: hamburger */}
        <button
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          className="text-foreground md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <FaXmark size={20} /> : <FaBars size={20} />}
        </button>
      </nav>

      {isMenuOpen && (
        <div className="bg-surface fixed top-16 right-0 left-0 z-50 mt-0 max-h-[calc(100vh-4rem)] space-y-1 overflow-y-auto px-7 pb-7 shadow-lg md:hidden">
          <div className="pt-3">
            <GlobalSearch />
          </div>

          <NextLink
            href="/"
            className="group text-foreground hover:bg-surface-secondary flex items-center rounded-lg p-2"
            onClick={closeMenu}
          >
            <FaCircleUser />
            <span className="ms-3">Characters</span>
          </NextLink>

          <NextLink
            href="/crouch-cancel-calculator"
            className="group text-foreground hover:bg-surface-secondary flex items-center rounded-lg p-2"
            onClick={closeMenu}
          >
            <FaCalculator />
            <span className="ms-3">Crouch Cancel Calculator</span>
          </NextLink>

          <a
            href="https://bot.fightcore.gg"
            target="_blank"
            rel="noopener noreferrer"
            className="group text-foreground hover:bg-surface-secondary flex items-center rounded-lg p-2"
            onClick={closeMenu}
          >
            <FaRobot />
            <span className="ms-3">Discord Bot</span>
          </a>

          <a
            href="https://drive.fightcore.gg"
            target="_blank"
            rel="noopener noreferrer"
            className="group text-foreground hover:bg-surface-secondary flex items-center rounded-lg p-2"
            onClick={closeMenu}
          >
            <FaGoogleDrive />
            <span className="ms-3">Drive</span>
          </a>

          <NextLink
            href="/credits"
            className="group text-foreground hover:bg-surface-secondary flex items-center rounded-lg p-2"
            onClick={closeMenu}
          >
            <FaAward />
            <span className="ms-3">Credits & Sources</span>
          </NextLink>

          <a
            href="https://ko-fi.com/fc_bort"
            target="_blank"
            rel="noopener noreferrer"
            className="group text-foreground hover:bg-surface-secondary flex items-center rounded-lg p-2"
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
