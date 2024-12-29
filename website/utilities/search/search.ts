import { characters } from '@/config/characters';
import { ExportedMove } from '@/models/exported-moves';

const distanceConfiguration = {
  caseSensitive: false,
};

const threshold = 0.8;

export async function search(query: string, items: ExportedMove[]): Promise<ExportedMove[]> {
  const keyWords = query.split(' ');
  if (keyWords.length === 0) {
    return items.slice(0, 3);
  }

  const searchResult = await findCharacter(keyWords);
  if (searchResult.name == null) {
    return [];
  }

  const remainingMoves = items.filter((move) => move.normalizedCharacterName === searchResult.name);

  if (!searchResult.remainder) {
    return remainingMoves.slice(0, 3);
  }

  const result = [];
  for (const move of remainingMoves) {
    const distance = await compareToMove(move, searchResult.remainder);
    if (distance && distance > threshold) {
      result.push({ move: move, distance: distance });
    }
  }

  return result
    .sort((a, b) => (b.distance > a.distance ? 1 : -1))
    .slice(0, 3)
    .map((result) => result.move);
}

async function findCharacter(keyWords: string[]): Promise<{
  name: string | null;
  remainder: string;
}> {
  let characterName = '';
  let topDistance = 0;
  let lastIndex = 0;
  let actualName = '';
  for (let index = 0; index < keyWords.length; index++) {
    const word = keyWords[index];
    characterName += word;
    for (const character of characters) {
      const distance = await compareToCharacter(character.name, character.normalizedName, characterName);

      // If the distance is undefined, nothing has been found and it can be skipped over.
      if (distance == undefined) {
        continue;
        // If the distance is greater than the top distance
        // save it as the new top distance.
      } else if (distance > topDistance) {
        actualName = character.normalizedName;
        topDistance = distance;
        lastIndex = index;
      }
    }
  }
  return {
    name: actualName,
    remainder: keyWords.slice(lastIndex + 1).join(' '),
  };
}

async function compareToCharacter(name: string, normalizedName: string, query: string): Promise<number | undefined> {
  let distance = 0;
  const jaroWinkler = (await import('jaro-winkler-typescript')).jaroWinkler;
  distance = jaroWinkler(normalizedName, query, distanceConfiguration);

  const nameDistance = jaroWinkler(name, query, {
    caseSensitive: false,
  });

  if (distance > nameDistance && threshold < distance) {
    return distance;
  } else if (threshold < nameDistance) {
    return nameDistance;
  }

  return undefined;
}

async function compareToMove(move: ExportedMove, query: string): Promise<number | undefined> {
  let distance = 0;
  const jaroWinkler = (await import('jaro-winkler-typescript')).jaroWinkler;
  distance = jaroWinkler(move.normalizedName, query, distanceConfiguration);

  const nameDistance = jaroWinkler(move.name, query, {
    caseSensitive: false,
  });

  if (distance > nameDistance && threshold < distance) {
    return distance;
  } else if (threshold < nameDistance) {
    return nameDistance;
  }

  return undefined;
}
