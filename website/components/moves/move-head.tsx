import { metaConfig, moveMetaDescription } from '@/config/meta';
import { siteConfig } from '@/config/site';
import { CharacterBase } from '@/models/character';
import { Move } from '@/models/move';
import { cloneObject } from '@/utilities/clone';
import { moveRoute } from '@/utilities/routes';
import NextHead from 'next/head';

export interface MoveHeadParams {
  move: Move;
  character: CharacterBase;
}

export const MoveHead = (params: MoveHeadParams) => {
  const title = `${params.character.name} ${params.move.name} - ${siteConfig.name}`;
  const description = moveMetaDescription(params.character, params.move);
  const baseTags = cloneObject(metaConfig.tags);

  baseTags.push(params.character.name);
  baseTags.push(params.character.normalizedName);
  baseTags.push(params.move.name);
  baseTags.push(params.move.normalizedName);

  const tags = baseTags.join(',');

  // eslint-disable-next-line max-len
  const imageAlt = `${params.character.name} ${params.move.name} frame by frame animation showcasing detailed hitbox information`;
  const url = `https://www.fightcore.gg${moveRoute(params.character, params.move)}`;
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
      {params.move.gifUrl ? (
        <meta property="og:image" content={params.move.gifUrl} />
      ) : (
        <meta property="og:image" content="https://i.fightcore.gg/Wordmark.png" />
      )}
      {params.move.gifUrl ? <meta property="og:image:alt" content={imageAlt} /> : <></>}

      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {params.move.gifUrl ? (
        <meta name="twitter:image" content={params.move.gifUrl} />
      ) : (
        <meta name="og:image" content="https://i.fightcore.gg/Wordmark.png" />
      )}
      {params.move.gifUrl ? <meta name="twitter:image:alt" content={imageAlt} /> : <></>}
    </NextHead>
  );
};
