import { indexMetaDescription } from '@/config/meta';
import { siteConfig } from '@/config/site';
import NextHead from 'next/head';

export const CharactersHead = () => {
  const title = `${siteConfig.name}`;
  const description = indexMetaDescription();
  const baseTags = ['frame data', 'super smash bros melee', 'melee', 'ssbm', 'melee frame data', 'frames'];
  const tags = baseTags.join(',');
  const url = `https://www.fightcore.gg`;
  return (
    <NextHead>
      {/* Standard SEO tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={tags} />
      <link rel="canonical" href={url} />

      {/* Open Graph tags for Facebook and LinkedIn */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content="https://i.fightcore.gg/Wordmark.png" />

      {/* Twitter Card tags */}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content="https://i.fightcore.gg/Wordmark.png" />
    </NextHead>
  );
};
