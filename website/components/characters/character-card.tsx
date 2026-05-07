import { FightcoreCard } from '@/components/ui/fightcore-card';
import { CharacterBase } from '@/models/character';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

interface CharacterCardInput {
  character: CharacterBase;
}

export const CharacterCard = (input: CharacterCardInput) => {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);
  const character = input.character;
  const classNames = React.useMemo(
    () => ({
      wrapper: ['border-0', 'shadow-none', 'p-0'],
      th: ['bg-transparent!', 'text-default-500', 'border-b', 'border-divider'],
      td: ['text-default-600', 'py-1'],
    }),
    [],
  );

  const properties = [
    { name: 'Weight', value: character.characterStatistics.weight },
    { name: 'Gravity', value: character.characterStatistics.gravity },
    { name: 'Walk Speed', value: character.characterStatistics.walkSpeed },
    { name: 'Run Speed', value: character.characterStatistics.runSpeed },
    { name: 'Wave Dash Length Rank', value: character.characterStatistics.waveDashLengthRank },
    { name: 'Initial Dash', value: character.characterStatistics.initialDash },
    { name: 'Dash frames', value: character.characterStatistics.dashFrames },
    { name: 'Jump Squat', value: character.characterStatistics.jumpSquat },
    { name: 'Can Wall Jump', value: character.characterStatistics.canWallJump ? 'Yes' : 'No' },
  ];
  return (
    <FightcoreCard
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => router.push('/characters/' + character.fightCoreId + '/' + character.normalizedName)}
      onMouseDown={(e) => {
        if (e.button === 1) {
          e.preventDefault();
          window.open('/characters/' + character.fightCoreId + '/' + character.normalizedName, '_blank');
        }
      }}
      className={'cursor-pointer ' + (hovered ? 'bg-surface-secondary' : '')}
    >
      <FightcoreCard.Header>
        <FightcoreCard.Title>
          <div className="flex flex-row gap-1">
            <Image
              width={20}
              height={20}
              alt={character.normalizedName}
              src={'/newicons/' + character.name + '.webp'}
              loading={'eager'}
            />
            <div>{character.name}</div>
          </div>
        </FightcoreCard.Title>
      </FightcoreCard.Header>
      <FightcoreCard.Body>
        {properties.map((property) => {
          return (
            <div key={character.normalizedName + '-' + property.name} className="flex flex-row justify-between">
              <div className="text-muted text-xs">{property.name}</div>
              <div className="bg-surface-secondary px-1 font-mono text-sm">{property.value}</div>
            </div>
          );
        })}
      </FightcoreCard.Body>
    </FightcoreCard>
  );
};
