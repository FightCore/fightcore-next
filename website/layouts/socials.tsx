import { siteConfig } from '@/config/site';
import { Link } from "@heroui/link";
import { FaDiscord, FaGithub } from 'react-icons/fa6';
import { ThemeSwitch } from '../components/theme-switch';

export const Socials = () => {
  return (
    <div className="flex flex-wrap justify-between">
      <Link className="justify-center" isExternal href={siteConfig.links.discord} aria-label="Discord">
        <FaDiscord className="text-foreground" />
      </Link>
      <Link className="justify-center" isExternal href={siteConfig.links.github} aria-label="Github">
        <FaGithub className="text-foreground" />
      </Link>
      <ThemeSwitch className="w-full" />
      <div className="mt-2 w-full">
        Created by <Link className="inline">Bort</Link>
      </div>
    </div>
  );
};
