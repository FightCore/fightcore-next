import { GithubIcon, DiscordIcon } from '@/components/icons';
import { siteConfig } from '@/config/site';
import { Link } from '@nextui-org/react';
import { ThemeSwitch } from '../theme-switch';
import { FaDiscord, FaGithub } from 'react-icons/fa6';
export const Socials = ({ ...params }) => {
  return (
    <div className={params.className}>
      <div className='grid grid-cols-3 my-2'>
        <Link
          className='justify-center'
          isExternal
          href={siteConfig.links.discord}
          aria-label='Discord'
        >
          <FaDiscord className='text-default-500' />
        </Link>
        <Link
          className='justify-center'
          isExternal
          href={siteConfig.links.github}
          aria-label='Github'
        >
          <FaGithub className='text-default-500' />
        </Link>
        <ThemeSwitch className='w-full min-w-full justify-center' />
      </div>
      <div className='w-full text-center'>
        <p>
          Created by <Link className='inline'>Bort</Link>
        </p>
      </div>
    </div>
  );
};
