import { characters } from "@/config/framedata/framedata";
import { CharacterCard } from "@/components/characters/character-card";
import { Head } from "@/layouts/head";

export default function Home() {
  return (
    <>
      <Head />
      <div
        className="h-16 w-full bg-gray-200 dark:bg-gray-800 rounded border
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
