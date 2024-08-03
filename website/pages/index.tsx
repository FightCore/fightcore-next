import { characters } from "@/config/framedata/framedata";
import { CharacterCard } from "@/components/characters/character-card";
import { CharactersHead } from "@/components/characters/characters-head";

export default function Home() {
  return (
    <>
      <CharactersHead />
      <div
        className="h-16 w-full text-white bg-red-700 rounded-b-md border-b border-l border-r
              border-gray-300 dark:border-gray-800 flex justify-center items-center mb-4"
      >
        <p className="text-2xl font-bold text-center">Characters</p>
      </div>
      <div className="p-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {characters.map((character) => (
          <CharacterCard key={character.normalizedName} character={character} />
        ))}
      </div>
    </>
  );
}
