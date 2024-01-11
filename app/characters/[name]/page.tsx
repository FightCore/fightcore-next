import { characters } from '@/config/framedata/framedata';

export function generateStaticParams() {
  return characters.map((character) => {
    return { name: character.normalizedName };
  });
}

export default function Character({ params }: { params: { name: string } }) {
  return <h1>{params.name}</h1>;
}
