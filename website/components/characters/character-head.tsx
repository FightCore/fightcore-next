import { characterMetaDescription, metaConfig } from '@/config/meta';
import { siteConfig } from '@/config/site';
import { CharacterBase } from '@/models/character';
import { characterRoute } from '@/utilities/routes';
import NextHead from 'next/head';

export interface CharacterHeadParams {
  character: CharacterBase;
}

export const CharacterHead = (params: CharacterHeadParams) => {
  const title = `${params.character.name} - ${siteConfig.name}`;
  const description = characterMetaDescription(params.character);

  const baseTags = structuredClone(metaConfig.tags);

  baseTags.push(params.character.name);
  baseTags.push(params.character.normalizedName);

  const tags = baseTags.join(',');

  const url = `https://www.fightcore.gg${characterRoute(params.character)}`;
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
