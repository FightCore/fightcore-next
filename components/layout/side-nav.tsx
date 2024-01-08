'use client';
import { Divider, Image, Link, Tooltip } from '@nextui-org/react';
import { Logo } from '../icons';
import { characters } from '@/config/framedata/framedata';
import React from 'react';
import { Socials } from './socials';
import { SearchBar } from './search-bar';

export const SideNav = () => {
  'use client';
  return (
    <div className='h-full flex flex-col p-2'>
      <div className='flex-1'>
        <div className='w-100 align-content-center flex p-3'>
          <Logo className='flex-1' height={50} width={100} />
        </div>
        <div className='p-2 grid grid-cols-4 gap-2'>
          {characters.map((character) => (
            <div key={character.normalizedName}>
              <Tooltip content={character.name} delay={1000}>
                <Image
                  className='grow'
                  alt={character.name}
                  width={40}
                  src={
                    'https://i.fightcore.gg/melee/stocks/' +
                    character.name +
                    '.png'
                  }
                />
              </Tooltip>
            </div>
          ))}
        </div>
        <Divider className='my-4' />

        <ul className='space-y-2 font-medium'>
          <li>
            <Link
              color='foreground'
              href='#'
              className='flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 group'
            >
              <svg
                className='w-5 h-5 transition duration-75 group-hover:text-gray-900 dark:group-hover:text-white'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='currentColor'
                viewBox='0 0 22 21'
              >
                <path d='M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z' />
                <path d='M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z' />
              </svg>
              <span className='ms-3'>Characters</span>
            </Link>
          </li>
          <li>
            <Link
              color='foreground'
              href='#'
              className='flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 group'
            >
              <svg
                className='w-5 h-5 transition duration-75 group-hover:text-gray-900 dark:group-hover:text-white'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='currentColor'
                viewBox='0 0 22 21'
              >
                <path d='M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z' />
                <path d='M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z' />
              </svg>
              <span className='ms-3'>Moves</span>
            </Link>
          </li>
          <li>
            <Link
              color='foreground'
              href='#'
              className='flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 group'
            >
              <svg
                className='w-5 h-5 transition duration-75 group-hover:text-gray-900 dark:group-hover:text-white'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='currentColor'
                viewBox='0 0 22 21'
              >
                <path d='M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z' />
                <path d='M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z' />
              </svg>
              <span className='ms-3'>Tournaments</span>
            </Link>
          </li>
        </ul>
      </div>
      <div className='grow'></div>
      <SearchBar className='mb-2' />
      <Socials className='shrink' />
    </div>
  );
};
