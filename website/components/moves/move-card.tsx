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
          <div className="flex flex-col gap-2 md:flex-row">
            <div className="w-72 max-w-full min-w-64 border-zinc-600 md:border-r">
              <h4 className="text-default-600 text-lg leading-none font-semibold">{params.move.name}</h4>
              <PreviewVideo move={params.move} characterName={params.character.name} lazy={params.move.type !== 2} />
            </div>
            <div className="grow">
              <div className="grid h-full grid-flow-row auto-rows-max gap-2 md:auto-rows-min md:justify-evenly">
                {fullMoveSummaries.map((summary) => {
                  return (
                    <div className={'p-3 ' + (summary.value === '-' ? 'hidden lg:block' : '')}>
                      <div className="text-default-700 font-bold">{summary.name}</div>
                      <div className="text-default-600">{summary.value}</div>
                    </div>
                  );
                })}
                <div className="w-full px-3 lg:col-start-1 lg:col-end-7">
                  <HitboxTimeline compact move={params.move}></HitboxTimeline>
                </div>
              </div>
            </div>
            <div>
              <Button
                href={moveRoute(params.character, params.move)}
                as={Link}
                className="h-full bg-red-700 font-bold text-white hover:bg-red-500 @sm:@max-md:w-full"
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
