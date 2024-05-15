'use client';
import { Divider, Image, Link, Tooltip } from '@nextui-org/react';
import { Logo } from '../components/icons';
import { characters } from '@/config/framedata/framedata';
import React from 'react';
import { Socials } from './socials';
import { SearchBar } from './search-bar';
import { FaCircleUser, FaRectangleList, FaTrophy } from 'react-icons/fa6';

export function SideNav() {
  return (
    <div className='h-full flex flex-col p-2'>
      <div className='flex-1'>
        <Link href='/' className='w-100 align-content-center flex p-3'>
          <Logo className='flex-1' height={50} width={100} />
        </Link>
        <div className='p-2 grid grid-cols-4 gap-2'>
          {characters.map((character) => (
            <div key={character.normalizedName}>
              <Tooltip content={character.name} delay={1000}>
                <Link href={'/characters/' + character.normalizedName}>
                  <Image
                    className='grow'
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
        <Divider className='my-4' />

        <ul className='space-y-2 font-medium'>
          <li>
            <Link
              color='foreground'
              href='#'
              className='flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 group'
            >
              <FaCircleUser />
              <span className='ms-3'>Characters</span>
            </Link>
          </li>
          <li>
            <Link
              color='foreground'
              href='#'
              className='flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 group'
            >
              <FaRectangleList />
              <span className='ms-3'>Moves</span>
            </Link>
          </li>
          <li>
            <Link
              color='foreground'
              href='#'
              className='flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 group'
            >
              <FaTrophy />
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
}
