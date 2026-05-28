import { indexMetaDescription, metaConfig } from '@/config/meta';
import { siteConfig } from '@/config/site';
import NextHead from 'next/head';

export const IndexHead = () => {
  const title = `${siteConfig.name}`;
  const description = indexMetaDescription();
  const tags = metaConfig.tags.join(',');
  const url = `https://www.fightcore.gg`;
  return (
    <NextHead>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={tags} />
      <link rel="canonical" href={url} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content="https://i.fightcore.gg/Wordmark.png" />

      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content="https://i.fightcore.gg/Wordmark.png" />
    </NextHead>
  );
};

export const CharactersHead = () => {
  const title = `Characters - ${siteConfig.shortName}`;
  const description = "Every Super Smash Bros. Melee character's complete frame data: hitboxes, knockback, startup frames, and crouch cancel percentages.";
  const tags = metaConfig.tags.join(',');
  const url = `https://www.fightcore.gg/characters`;
  return (
    <NextHead>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={tags} />
      <link rel="canonical" href={url} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content="https://i.fightcore.gg/Wordmark.png" />

      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content="https://i.fightcore.gg/Wordmark.png" />
    </NextHead>
  );
};
