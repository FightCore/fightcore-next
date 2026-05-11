import HitboxTimeline from '@/components/moves/hitboxes/hitbox-timeline';
import { CharacterBase } from '@/models/character';
import { Move } from '@/models/move';
import { getHitboxesSummary, getMoveSummary, MovePropertySummary } from '@/utilities/move-summary';
import { moveRoute } from '@/utilities/routes';
import { Card } from '@heroui/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { PreviewVideo } from './animations/preview-video';

interface MoveCardParams {
  move: Move;
  character: CharacterBase;
  lazy: boolean;
}

export const MoveCard = (params: MoveCardParams) => {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);
  const moveSummary = getMoveSummary(params.move).filter((summary) => !summary.variant);

  let sectionHeaders = [
    ['First Active', 'Last Active', 'Total', 'IASA'],
    ['Landing lag', 'Landing fall special lag', 'Autocancel'],
    ['Damage', 'Angle', 'Effect'],
    ['Base Knockback', 'Knockback Growth', 'Set Knockback'],
  ];

  const sections = [];
  let fullMoveSummaries: MovePropertySummary[] = [...moveSummary];
  if (params.move.hits && params.move.hits.length > 0) {
    const hitboxSummary = getHitboxesSummary(params.move.hits.flatMap((hit) => hit.hitboxes));
    fullMoveSummaries = [...fullMoveSummaries, ...hitboxSummary];
  } else {
    // Cut off the hitbox parameters.
    sectionHeaders = sectionHeaders.slice(0, 2);
  }

  for (let section of sectionHeaders) {
    sections.push(fullMoveSummaries.filter((summary) => section.includes(summary.name)));
  }

  return (
    <Card.Root
      key={params.move.normalizedName}
      variant={hovered ? 'secondary' : 'default'}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => router.push(moveRoute(params.character, params.move))}
      onMouseDown={(e) => {
        if (e.button === 1) {
          e.preventDefault();
          window.open(moveRoute(params.character, params.move), '_blank');
        }
      }}
      className="w-full cursor-pointer rounded-none p-2"
    >
      <Card.Content className="text-small text-default-400 px-3 py-0">
        <div className="flex flex-col gap-2 lg:flex-row">
          <div className="w-72 max-w-full min-w-64 border-zinc-600 lg:border-r">
            <PreviewVideo move={params.move} character={params.character} lazy={params.move.type !== 2} />
          </div>
          <div className="flex h-full grow flex-col">
            <h4 className="text-default-600 text-lg leading-none font-semibold">{params.move.name}</h4>
            <div></div>
            <HitboxTimeline move={params.move}></HitboxTimeline>
            {sections.map((section, index) => {
              return (
                <div
                  key={section[0].name}
                  className="grid grid-cols-2 gap-2 pb-3 md:grid-cols-4 min-[70rem]:justify-between"
                >
                  {section.map((summary, index) => {
                    return (
                      <div
                        key={`${params.move.id}-${summary.name}-${index}`}
                        className={'flex-col ' + (summary.value === '-' ? 'hidden lg:flex' : '')}
                      >
                        <div className="text-muted text-xs">{summary.name}</div>
                        <div className="bg-surface-secondary px-1 font-mono text-sm">{summary.value}</div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </Card.Content>
    </Card.Root>
  );
};
