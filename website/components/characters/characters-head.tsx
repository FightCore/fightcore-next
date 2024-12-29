import React from 'react';
import NextHead from 'next/head';
import { siteConfig } from '@/config/site';

export const CharactersHead = () => {
  const title = `${siteConfig.name}`;
  const description =
    title + ' showcases all the data about the frame data, hitboxes and with an interactive animation player.';
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

      {/* Twitter Card tags */}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </NextHead>
  );
};
