'use client';

import { CharacterBase } from '@/models/character';
import { Move } from '@/models/move';
import { moveRoute } from '@/utilities/routes';
import { Button, Modal, Popover, Surface } from '@heroui/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FaCircleQuestion, FaExpand, FaXmark } from 'react-icons/fa6';

import { AnimationLegendContent } from './animation-legend';
import ApngMove from './apng-move-gif';
import { MoveGif } from './move-gif';

export interface PreviewVideoParams {
  move: Move;
  character: CharacterBase;
  lazy: boolean;
}

function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <Surface className="flex-1 rounded-md p-3" variant="secondary">
      <div className="flex flex-col">
        <span className="text-muted text-sm">{label}</span>
        <span>{value}</span>
      </div>
    </Surface>
  );
}

function Lightbox({
  move,
  character,
  isIOS,
  isOpen,
  onClose,
}: {
  move: Move;
  character: CharacterBase;
  isIOS: boolean;
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();

  const stats: { label: string; value: string }[] = [
    ...(move.start != null ? [{ label: 'First active', value: `${move.start}` }] : []),
    ...(move.start != null && move.end != null ? [{ label: 'Last active', value: `${move.end}` }] : []),
    { label: 'Total', value: `${move.totalFrames} frames` },
    ...(move.iasa != null ? [{ label: 'IASA', value: `${move.iasa}` }] : []),
  ];

  return (
    <Modal.Root isOpen={isOpen} onOpenChange={onClose}>
      <Modal.Backdrop>
        <Modal.Container size="lg">
          <Modal.Dialog>
            <Modal.Header className="flex flex-row items-start justify-between gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-xl font-bold">{move.name}</span>
              </div>
              <Button isIconOnly size="sm" variant="outline" onPress={onClose} aria-label="Close">
                <FaXmark size={14} />
              </Button>
            </Modal.Header>
            <Modal.Body className="gap-4">
              <div className="overflow-hidden rounded-xl">
                {isIOS ? (
                  <MoveGif characterName={character.name} move={move} />
                ) : (
                  <ApngMove showAdditionalControls={true} url={move.pngUrl!} />
                )}
              </div>
              {stats.length > 0 && (
                <div className="justify flex w-full gap-2">
                  {stats.map((s) => (
                    <StatChip key={s.label} label={s.label} value={s.value} />
                  ))}
                </div>
              )}
              {move.notes && <p className="text-foreground-500 text-sm">{move.notes}</p>}
            </Modal.Body>
            <Modal.Footer>
              <Button className="w-full" onPress={() => router.push(moveRoute(character, move))}>
                View full move
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal.Root>
  );
}

export function PreviewVideo(params: Readonly<PreviewVideoParams>) {
  const [isOpen, setIsOpen] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    setIsIOS(/iPhone|iPad|iPod/i.test(navigator.userAgent));
  }, []);

  const getPlayer = () => {
    if (!params.move.webmUrl || (isIOS && !params.move.gifUrl)) {
      return <em>There is no GIF available</em>;
    }

    if (isIOS && params.move.gifUrl) {
      return (
        <img
          className="w-full"
          src={params.move.gifUrl}
          alt={params.character.name + ' ' + params.move.name}
          loading={params.lazy ? 'lazy' : 'eager'}
        />
      );
    }

    return <video className="w-full" muted playsInline autoPlay loop src={params.move.webmUrl} />;
  };

  return (
    <>
      <div className="relative w-72 max-w-full min-w-64">
        <div className="group relative cursor-pointer" onClick={() => setIsOpen(true)}>
          {getPlayer()}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <div className="rounded-full bg-black/60 p-3 backdrop-blur-sm">
              <FaExpand size={24} className="text-white" />
            </div>
          </div>
        </div>
        <Popover.Root>
          <Popover.Trigger>
            <button
              aria-label="Hitbox legend"
              className="absolute right-1 bottom-1 cursor-pointer rounded-full bg-black/50 p-1 text-white/80 backdrop-blur-sm transition-colors hover:bg-black/70 hover:text-white"
            >
              <FaCircleQuestion size={16} />
            </button>
          </Popover.Trigger>
          <Popover.Content className="max-w-md p-4" placement="right">
            <AnimationLegendContent />
          </Popover.Content>
        </Popover.Root>
      </div>

      <Lightbox
        move={params.move}
        character={params.character}
        isIOS={isIOS}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
