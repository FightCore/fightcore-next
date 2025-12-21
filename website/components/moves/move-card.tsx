import HitboxTimeline from '@/components/moves/hitboxes/hitbox-timeline';
import { CharacterBase } from '@/models/character';
import { Move } from '@/models/move';
import { getHitboxesSummary, getMoveSummary, MovePropertySummary } from '@/utilities/move-summary';
import { moveRoute } from '@/utilities/routes';
import { Button } from '@heroui/button';
import { Card, CardBody } from '@heroui/card';
import Link from 'next/link';
import React from 'react';
import { PreviewVideo } from './animations/preview-video';

interface MoveCardParams {
  move: Move;
  character: CharacterBase;
  lazy: boolean;
}

export const MoveCard = (params: MoveCardParams) => {
  const classNames = React.useMemo(
    () => ({
      td: ['text-default-600'],
    }),
    [],
  );
  const stats: [string, keyof Move][] = [
    ['Auto Cancel Before', 'autoCancelBefore'],
    ['Auto Cancel After', 'autoCancelAfter'],
    ['IASA', 'iasa'],
    ['L-Canceled Land Lag', 'lCanceledLandLag'],
    ['Land Lag', 'landLag'],
    ['Landing Fall Special Lag', 'landingFallSpecialLag'],
    ['Notes', 'notes'],
  ];

  const moveSummary = getMoveSummary(params.move).filter((summary) => !summary.variant);
  let fullMoveSummaries: MovePropertySummary[] = [...moveSummary];
  if (params.move.hits && params.move.hits.length > 0) {
    const hitboxSummary = getHitboxesSummary(params.move.hits.flatMap((hit) => hit.hitboxes));
    fullMoveSummaries = [...fullMoveSummaries, ...hitboxSummary];
  }

  return (
    <>
      <Card key={params.move.normalizedName} className="w-full p-2 dark:bg-gray-800">
        <CardBody className="text-small text-default-400 px-3 py-0">
          <div className="flex flex-col gap-2 lg:flex-row">
            <div className="w-72 max-w-full min-w-64 border-zinc-600 lg:border-r">
              <h4 className="text-default-600 text-lg leading-none font-semibold">{params.move.name}</h4>
              <PreviewVideo move={params.move} characterName={params.character.name} lazy={params.move.type !== 2} />
            </div>
            <div className="flex h-full grow flex-col gap-2">
              <div className="grid grid-cols-2 gap-2 pb-3 min-[64rem]:max-[70rem]:grid-cols-4 min-[70rem]:grid-cols-6 min-[70rem]:justify-evenly">
                {fullMoveSummaries.map((summary, index) => {
                  return (
                    <div
                      key={`${params.move.id}-${summary.name}-${index}`}
                      className={summary.value === '-' ? 'hidden lg:block' : ''}
                    >
                      <div className="text-default-700 font-bold">{summary.name}</div>
                      <div className="text-default-600">{summary.value}</div>
                    </div>
                  );
                })}
              </div>
              <div
                className={
                  'w-full' +
                  (params.move.totalFrames > 80 || params.move.hits?.some((hit) => !!hit.start) == false
                    ? ' hidden'
                    : '')
                }
              >
                <HitboxTimeline compact move={params.move}></HitboxTimeline>
              </div>
              <Button
                href={moveRoute(params.character, params.move)}
                as={Link}
                className="min-h-6 w-full bg-red-700 text-center font-bold text-white hover:bg-red-500 lg:hidden"
              >
                View
              </Button>
            </div>
            <div>
              <Button
                href={moveRoute(params.character, params.move)}
                as={Link}
                className="h-full bg-red-700 font-bold text-white hover:bg-red-500 max-lg:hidden"
              >
                View
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  );
};
