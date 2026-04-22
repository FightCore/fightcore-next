'use client';
import { GlobalSearch } from '@/components/global-search/global-search';
import { characters } from '@/config/framedata/framedata';
import { VERSION_NUMBER } from '@/layouts/version-number';
import { characterRoute } from '@/utilities/routes';
import { Tooltip } from '@heroui/react';
import Image from 'next/image';
import NextLink from 'next/link';
import { FaAward, FaCalculator, FaCircleUser, FaGoogleDrive, FaMugHot, FaRobot } from 'react-icons/fa6';
import { Logo } from '../components/icons';
import { Socials } from './socials';

export function SideNav() {
  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="bg-red-700 p-2 text-white dark:bg-transparent">
        <NextLink href="/" className="align-content-center flex">
          <Logo className="flex-1" height={50} width={50} />
        </NextLink>
        {process.env.IS_BETA ? <p>Beta</p> : null}
      </div>
      <div className="px-2">
        <div className="py-3">
          <GlobalSearch />
        </div>
        <div className="grid grid-cols-4 gap-2 p-2">
          {characters.map((character) => (
            <div key={character.normalizedName}>
              <Tooltip delay={1000}>
                <Tooltip.Trigger>
                  <NextLink href={characterRoute(character)}>
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
        <hr className="my-1 border-gray-200 dark:border-gray-700" />

        <ul className="space-y-1 font-medium">
          <li>
            <NextLink
              href="/"
              className="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
            >
              <FaCircleUser />
              <span className="ms-3">Characters</span>
            </NextLink>
          </li>
          <li>
            <NextLink
              href="/crouch-cancel-calculator"
              className="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
            >
              <FaCalculator />
              <span className="ms-3">Crouch Cancel Calculator</span>
            </NextLink>
          </li>
          <li>
            <a
              href="https://bot.fightcore.gg"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
            >
              <FaRobot />
              <span className="ms-3">Discord Bot</span>
            </a>
          </li>
          <li>
            <a
              href="https://drive.fightcore.gg"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
            >
              <FaGoogleDrive />
              <span className="ms-3">Drive</span>
            </a>
          </li>
          <li>
            <NextLink
              href="/credits"
              className="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
            >
              <FaAward />
              <span className="ms-3">Credits & Sources</span>
            </NextLink>
          </li>
          <li>
            <a
              href="https://ko-fi.com/fc_bort"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
            >
              <FaMugHot />
              <span className="ms-3">Buy me a coffee</span>
            </a>
          </li>
        </ul>
      </div>
      <div className="grow" />
      <div className="mb-5 px-4">
        <Socials />
        <NextLink className="mt-2" href="/patchnotes">
          Version {VERSION_NUMBER}
        </NextLink>
      </div>
    </div>
  );
}
