import { Card, CardBody } from '@heroui/card';
import { Image } from '@heroui/image';
import Link from 'next/link';

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

export function SearchResultCard({ result, onNavigate }: SearchResultCardProps) {
  const moveUrl = `/characters/${result.characterId}/${encodeURIComponent(result.normalizedCharacterName)}/moves/${result.moveId}/${encodeURIComponent(result.normalizedMoveName)}/`;

  return (
    <Link href={moveUrl} onClick={onNavigate}>
      <Card className="w-full p-2 transition-colors hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700">
        <CardBody className="p-2">
          <div className="mb-2 flex gap-2">
            <Image alt={result.character} width={40} height={40} src={'/newicons/' + result.character + '.webp'} />
            <div>
              <h4 className="text-default-700 truncate font-semibold">{result.move}</h4>
              <p className="text-default-500 text-sm">{result.character}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <div>{result.image !== null && <Image src={result.image} height={200} />}</div>
            <div className="">
              <div className="min-w-0 flex-1">
                <div className="text-default-500 mt-1 flex flex-col flex-wrap">
                  {result.start !== null && (
                    <span>
                      <span className="font-semibold">Start:</span> {result.start}
                    </span>
                  )}
                  {result.end !== null && (
                    <span>
                      <span className="font-semibold">End:</span> {result.end}
                    </span>
                  )}
                  {result.damage && result.damage?.length > 0 && (
                    <span>
                      <span className="font-semibold">Damage:</span> {result.damage.join(' / ')}
                    </span>
                  )}
                  {result.baseKnockback && result.baseKnockback?.length > 0 && (
                    <span>
                      <span className="font-semibold">Base knockback:</span> {result.baseKnockback.join(' / ')}
                    </span>
                  )}
                  {result.knockbackGrowth && result.knockbackGrowth?.length > 0 && (
                    <span>
                      <span className="font-semibold">Knockback growth:</span> {result.knockbackGrowth.join(' / ')}
                    </span>
                  )}
                  {result.setKnockback && result.setKnockback?.length > 0 && (
                    <span>
                      <span className="font-semibold">Set knockback:</span> {result.setKnockback.join(' / ')}
                    </span>
                  )}

                  {result.notes !== null && (
                    <span>
                      <span className="font-semibold">Notes:</span> {result.notes}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}
