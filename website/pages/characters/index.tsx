import { CharacterCard } from '@/components/characters/character-card';
import { CharactersHead } from '@/components/characters/characters-head';
import { PageTitle } from '@/components/page-title';
import { characters } from '@/config/framedata/framedata';
import NextHead from 'next/head';

export default function Home() {
  return (
    <>
      <NextHead>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@100..900&display=swap" rel="stylesheet" />
      </NextHead>
      <CharactersHead />
      <PageTitle title="Characters" />
      <div className="grid grid-cols-1 gap-4 pt-4 pb-2 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {characters.map((character) => (
          <CharacterCard key={character.normalizedName} character={character} />
        ))}
      </div>
    </>
  );
}
