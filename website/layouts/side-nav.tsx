'use client';
import { characters } from '@/config/framedata/framedata';
import { characterRoute } from '@/utilities/routes';
import { Divider } from '@heroui/divider';
import { Image } from '@heroui/image';
import { Link } from '@heroui/link';
import { Tooltip } from '@heroui/tooltip';
import { FaAward, FaCalculator, FaCircleUser, FaGoogleDrive, FaMugHot, FaRobot } from 'react-icons/fa6';
import { Logo } from '../components/icons';
import { Socials } from './socials';

export function SideNav() {
  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="bg-red-700 p-2 text-white dark:bg-transparent">
        <Link href="/" className="align-content-center flex">
          <Logo className="flex-1" height={50} width={50} />
        </Link>
        {process.env.IS_BETA ? <p>Beta</p> : <></>}
      </div>
      <div className="px-2">
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
        <Divider className="my-1" />

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
      <div className="grow" />
      <div className="mb-5 px-4">
        <Socials />
        <Link className="mt-2" href="/patchnotes">
          Version 1.2.0
        </Link>
      </div>
    </div>
  );
}
