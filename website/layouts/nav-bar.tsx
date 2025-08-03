import { characters } from '@/config/framedata/framedata';
import { characterRoute } from '@/utilities/routes';
import { Divider } from '@heroui/divider';
import { Image } from '@heroui/image';
import { Link } from '@heroui/link';
import { Navbar, NavbarBrand, NavbarContent, NavbarMenu, NavbarMenuItem, NavbarMenuToggle } from '@heroui/navbar';
import { Tooltip } from '@heroui/tooltip';
import React from 'react';
import { FaAward, FaCalculator, FaCircleUser, FaGoogleDrive, FaMugHot, FaRobot } from 'react-icons/fa6';
import { Logo } from '../components/icons';
import { Socials } from './socials';

export const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  return (
    <Navbar className="dark:bg-background bg-red-700" onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle aria-label={isMenuOpen ? 'Close menu' : 'Open menu'} />
        <NavbarBrand>
          <Link href="/">
            <Logo height={50} width={200} />
          </Link>
          {process.env.IS_BETA ? <p>Beta</p> : <></>}
        </NavbarBrand>
      </NavbarContent>
      <NavbarMenu className="mt-3 space-y-1 px-7">
        <NavbarMenuItem>
          <Link
            color="foreground"
            href="/"
            className="group flex items-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <FaCircleUser />
            <span className="ms-3">Characters</span>
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link
            color="foreground"
            href="/crouch-cancel-calculator"
            className="group flex items-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <FaCalculator />
            <span className="ms-3">Crouch Cancel Calculator</span>
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link
            color="foreground"
            href="https://bot.fightcore.gg"
            isExternal
            className="group flex items-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <FaRobot />
            <span className="ms-3">Discord Bot</span>
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link
            color="foreground"
            href="https://drive.fightcore.gg"
            isExternal
            className="group flex items-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <FaGoogleDrive />
            <span className="ms-3">Drive</span>
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link
            color="foreground"
            href="/credits"
            className="group flex items-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <FaAward />
            <span className="ms-3">Credits & Sources</span>
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link
            color="foreground"
            href="https://ko-fi.com/fc_bort"
            target="_blank"
            className="group flex items-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <FaMugHot />
            <span className="ms-3">Buy me a coffee</span>
          </Link>
        </NavbarMenuItem>

        <div className="py-2">
          <Divider></Divider>
        </div>
        <div className="flex w-full flex-row flex-wrap justify-start gap-5">
          {characters.map((character) => (
            <div key={character.normalizedName}>
              <Tooltip content={character.name} delay={1000}>
                <Link href={characterRoute(character)}>
                  <Image
                    className="grow text-white"
                    alt={character.name}
                    width={40}
                    height={40}
                    src={'/newicons/' + character.name + '.webp'}
                  />
                </Link>
              </Tooltip>
            </div>
          ))}
        </div>

        <div className="flex h-full flex-row pb-7">
          <div className="w-full self-end">
            <Socials />
            <Link className="mt-2" href="/patchnotes">
              Version 1.1.1
            </Link>
          </div>
        </div>
      </NavbarMenu>
    </Navbar>
  );
};
