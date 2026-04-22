import { siteConfig } from '@/config/site';
import { FaDiscord, FaGithub } from 'react-icons/fa6';
import { ThemeSwitch } from '../components/theme-switch';

export const Socials = () => {
  return (
    <div>
      <div className="flex w-full items-center justify-between">
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
        <ThemeSwitch />
      </div>
      <div className="mt-2">
        Created by <span className="cursor-default text-(--accent)">Bort</span>
      </div>
    </div>
  );
};
