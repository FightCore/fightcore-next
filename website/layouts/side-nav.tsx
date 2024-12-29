'use client';
import { Divider } from '@nextui-org/divider';
import { Image } from '@nextui-org/image';
import { Link } from '@nextui-org/link';
import { Tooltip } from '@nextui-org/tooltip';
import { Logo } from '../components/icons';
import { characters } from '@/config/framedata/framedata';
import React from 'react';
import { Socials } from './socials';
import { SearchBar } from './search-bar';
import {
  FaAward,
  FaCalculator,
  FaCircleUser,
  FaGoogleDrive,
  FaMugHot,
  FaRectangleList,
  FaRobot,
} from 'react-icons/fa6';
import { characterRoute } from '@/utilities/routes';
import Script from 'next/script';

export function SideNav() {
  return (
    <div className="flex h-full flex-col overflow-y-auto px-2">
      <div className="flex-1">
        <div className="mb-2 rounded-b-lg bg-red-700 p-1 text-white">
          <Link href="/" className="w-100 align-content-center flex">
            <Logo className="flex-1" height={50} width={100} />
          </Link>
          {process.env.IS_BETA ? <p>Beta</p> : <></>}
        </div>

        <div className="grid grid-cols-4 gap-2 p-2">
          {characters.map((character) => (
            <div key={character.normalizedName}>
              <Tooltip content={character.name} delay={1000}>
                <Link href={characterRoute(character)}>
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
        </div>
        <Divider className="my-4" />

        <ul className="space-y-1 font-medium">
          <li>
            <Link
              color="foreground"
              href="/"
              className="group flex items-center rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FaCircleUser />
              <span className="ms-3">Characters</span>
            </Link>
          </li>
          <li>
            <Link
              color="foreground"
              href="/crouch-cancel-calculator"
              className="group flex items-center rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FaCalculator />
              <span className="ms-3">Crouch Cancel Calculator</span>
            </Link>
          </li>
          <li>
            <Link
              color="foreground"
              href="https://bot.fightcore.gg"
              isExternal
              className="group flex items-center rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FaRobot />
              <span className="ms-3">Discord Bot</span>
            </Link>
          </li>
          <li>
            <Link
              color="foreground"
              href="https://drive.fightcore.gg"
              isExternal
              className="group flex items-center rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FaGoogleDrive />
              <span className="ms-3">Drive</span>
            </Link>
          </li>
          <li>
            <Link
              color="foreground"
              href="/credits"
              className="group flex items-center rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FaAward />
              <span className="ms-3">Credits & Sources</span>
            </Link>
          </li>
          <li>
            <Link
              color="foreground"
              href="https://ko-fi.com/fc_bort"
              target="_blank"
              className="group flex items-center rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FaMugHot />
              <span className="ms-3">Buy me a coffee</span>
            </Link>
          </li>
        </ul>
      </div>
      <div className="grow"></div>
      <Socials className="shrink" />
      <div className="w-full text-center">
        <Link href="/patchnotes">Version 1.0.1</Link>
      </div>
    </div>
  );
}
