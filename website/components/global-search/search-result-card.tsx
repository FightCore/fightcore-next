import { FightcoreCard } from '@/components/ui/fightcore-card';
import { Button, Skeleton } from '@heroui/react';
import { useRouter } from 'next/router';
import { useState } from 'react';

export interface SearchResult {
  id: number;
  characterId: number;
  moveId: number;
  character: string;
  move: string;
  normalizedCharacterName: string;
  normalizedMoveName: string;
  image: string;
  title: string;
  description: string;
  start: number | null;
  end: number | null;
  totalFrames: number | null;
  damage: string[] | null;
  angle: number | null;
  baseKnockback: number[] | null;
  knockbackGrowth: number[] | null;
  setKnockback: number[] | null;
  landLag: number | null;
  lCancelledLandLag: number | null;
  iASA: number | null;
  autoCancelBefore: number | null;
  autoCancelAfter: number | null;
  notes: string | null;
}

interface SearchResultCardProps {
  result: SearchResult;
  onNavigate: () => void;
}

function ImageWithSkeleton({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="relative w-full">
      {!loaded && <Skeleton animationType="shimmer" className="h-80 w-full" />}
      <img
        src={src}
        alt={alt}
        className={loaded ? 'w-full' : 'invisible absolute inset-0 h-full w-full'}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}

export function SearchResultCard({ result, onNavigate }: SearchResultCardProps) {
  const router = useRouter();
  const moveUrl = `/characters/${result.characterId}/${encodeURIComponent(result.normalizedCharacterName)}/moves/${result.moveId}/${encodeURIComponent(result.normalizedMoveName)}/`;
  const stats = generateStats(result);
  return (
    <FightcoreCard className="flex h-full flex-col rounded-none">
      <FightcoreCard.Header>
        <FightcoreCard.Title>{result.move}</FightcoreCard.Title>
      </FightcoreCard.Header>
      <FightcoreCard.Body className="min-h-0 flex-1 overflow-y-auto">
        {result.image !== null && <ImageWithSkeleton src={result.image} alt={result.move} />}
        <div className="flex flex-col">
          {stats.map((stat) => {
            return (
              <div key={stat.name} className="flex flex-row justify-between">
                <div className="text-muted text-sm">{stat.name}</div>
                <div className="bg-surface-secondary px-1 font-mono text-sm">{stat.value}</div>
              </div>
            );
          })}
        </div>
      </FightcoreCard.Body>
      <FightcoreCard.Footer>
        <Button className="w-full" onPress={() => { router.push(moveUrl); onNavigate(); }}>View full data</Button>
      </FightcoreCard.Footer>
    </FightcoreCard>
  );
}

function generateStats(result: SearchResult): { name: string; value: string }[] {
  const results = [];

  if (result.start) {
    results.push({ name: 'Start', value: result.start.toString() });
  }
  if (result.end) {
    results.push({ name: 'End', value: result.end.toString() });
  }
  if (result.totalFrames) {
    results.push({ name: 'Total', value: result.totalFrames.toString() });
  }
  if (result.damage) {
    results.push({ name: 'Damage', value: result.damage.map((damage) => damage + '%').join(', ') });
  }

  return results;
}
