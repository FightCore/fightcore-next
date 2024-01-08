import {
  Image,
  Card,
  CardHeader,
  Button,
  CardBody,
  CardFooter,
} from '@nextui-org/react';
import { characters } from '@/config/framedata/framedata';
import { CharacterCard } from './characters/character-card';

export default function Home() {
  return (
    <div className='p-2 grid grid-cols-4 gap-4'>
      {characters.map((character) => (
        <CharacterCard key={character.normalizedName} character={character} />
      ))}
    </div>
  );
}
