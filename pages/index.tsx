import { characters } from '@/config/framedata/framedata';
import { CharacterCard } from '@/components/characters/character-card';
import { Head } from '@/layouts/head';

export default function Home() {
  return (
    <>
      <Head />
      <div className='p-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        {characters.map((character) => (
          <CharacterCard key={character.normalizedName} character={character} />
        ))}
      </div>
    </>
  );
}
