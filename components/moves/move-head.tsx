import React from "react";
import NextHead from "next/head";
import { siteConfig } from "@/config/site";
import { Move } from "@/models/move";
import { CharacterBase } from "@/models/character";

export interface MoveHeadParams {
  move: Move;
  character: CharacterBase;
}

export const MoveHead = (params: MoveHeadParams) => {
  const title = `${params.character.name} ${params.move.name} - ${siteConfig.name}`;
  const description =
    title + " showcases all the data about the frame data, hitboxes and has an interactive animation player.";
  const baseTags = ["frame data", "super smash bros melee", "melee", "ssbm", "melee frame data", "frames"];
  const tags = baseTags.join(",");
  const imageAlt = `${params.character.name} ${params.move.name} frame by frame animation`;
  const url = `https://www.fightcore.gg/${params.character.normalizedName}/${params.move.normalizedName}`;
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
      <meta property="og:url" content="https://www.yourwebsite.com/optimal-seo-strategies" />
      {params.move.gifUrl ? <meta property="og:image" content={params.move.gifUrl} /> : <></>}
      {params.move.gifUrl ? <meta property="og:image:alt" content={imageAlt} /> : <></>}

      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {params.move.gifUrl ? <meta name="twitter:image" content={params.move.gifUrl} /> : <></>}
      {params.move.gifUrl ? <meta name="twitter:image:alt" content={imageAlt} /> : <></>}
    </NextHead>
  );
};
