import { Accordion, AccordionItem } from '@nextui-org/accordion';
import { Chip } from '@nextui-org/chip';
import { FaCircleQuestion } from 'react-icons/fa6';

export default function AnimationLegend() {
  return (
    <Accordion>
      <AccordionItem
        startContent={<FaCircleQuestion />}
        key="1"
        aria-label="Hitbox GIF legend"
        title="Hitbox GIF Legend"
        subtitle="Open this to learn more about what the hitbox colors mean"
      >
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <h2 className="text-xl">Hitbox IDs</h2>
            <div className="mt-2 grid grid-cols-1">
              <Chip variant="dot" radius="sm" classNames={{ dot: 'bg-red-500', base: 'w-full' }}>
                id0
              </Chip>
              <Chip variant="dot" radius="sm" classNames={{ dot: 'bg-green-500', base: 'w-full' }}>
                id1
              </Chip>
              <Chip variant="dot" radius="sm" classNames={{ dot: 'bg-blue-300', base: 'w-full' }}>
                id2
              </Chip>
              <Chip variant="dot" radius="sm" classNames={{ dot: 'bg-purple-500', base: 'w-full' }}>
                id3
              </Chip>
            </div>
          </div>
          <div>
            <h2 className="text-xl">Bone colors</h2>
            <div className="mt-2 grid grid-cols-1">
              <Chip variant="dot" radius="sm" classNames={{ dot: 'bg-yellow-500', base: 'w-full' }}>
                Normal
              </Chip>
              <Chip variant="dot" radius="sm" classNames={{ dot: 'bg-yellow-600', base: 'w-full' }}>
                Ungrabbable
              </Chip>
              <Chip variant="dot" radius="sm" classNames={{ dot: 'bg-blue-700', base: 'w-full' }}>
                Intangible
              </Chip>
              <Chip variant="dot" radius="sm" classNames={{ dot: 'bg-green-500', base: 'w-full' }}>
                Invincible
              </Chip>
            </div>
          </div>
          <div>
            <h2 className="text-xl">Character colors</h2>
            <div className="mt-2 grid grid-cols-1">
              <Chip variant="dot" radius="sm" classNames={{ dot: 'bg-orange-500', base: 'w-full' }}>
                Auto Cancel Frame
              </Chip>
              <Chip variant="dot" radius="sm" classNames={{ dot: 'bg-pink-500', base: 'w-full' }}>
                IASA
              </Chip>
            </div>
          </div>
        </div>
        <div className="mt-1">
          <div className="text-bold text-xl">Missing hitbox ids</div>
          <div>
            Sometimes it can appear that the move has multiple coloured hitboxes but is missing them in the table. The
            code for the colouring and the data itself missmatch sometimes. When this is the case,{' '}
            <strong>all hitboxes can be considered to have that data.</strong>
          </div>
        </div>
      </AccordionItem>
    </Accordion>
  );
}
