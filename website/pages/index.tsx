import { characters } from '@/config/framedata/framedata';
import { CharacterCard } from '@/components/characters/character-card';
import { CharactersHead } from '@/components/characters/characters-head';

export default function Home() {
  return (
    <>
      <CharactersHead />
      <div className="mb-4 flex h-16 w-full items-center justify-center rounded-b-md border-b border-l border-r border-gray-300 bg-red-700 text-white dark:border-gray-800">
        <p className="text-center text-2xl font-bold">Characters</p>
      </div>
      <div className="grid grid-cols-1 gap-4 p-2 md:grid-cols-2 lg:grid-cols-4">
        {characters.map((character) => (
          <CharacterCard key={character.normalizedName} character={character} />
        ))}
      </div>
    </>
  );
}
