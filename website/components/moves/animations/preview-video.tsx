'use client';

import { CharacterBase } from '@/models/character';
import { Move } from '@/models/move';
import { moveRoute } from '@/utilities/routes';
import { Button, Modal, Popover, Surface } from '@heroui/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FaCircleQuestion, FaExpand, FaXmark } from 'react-icons/fa6';

import { AnimationDisplay } from './animation-display';
import { AnimationLegendContent } from './animation-legend';
import { AnimationPlayerProvider } from './animation-player-context';
import { AnimationPlayerControls } from './animation-player-controls';
import { AnimationCredit } from './controls/animation-credit';
import { createEvent } from '@/utilities/create-event';

export interface PreviewVideoParams {
  move: Move;
  character: CharacterBase;
  lazy: boolean;
}

function Lightbox({
  move,
  character,
  isOpen,
  onClose,
}: {
  move: Move;
  character: CharacterBase;
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();

  return (
    <Modal.Root isOpen={isOpen} onOpenChange={onClose}>
      <Modal.Backdrop>
        <Modal.Container size="lg">
          <Modal.Dialog>
            <Modal.Header className="flex flex-row items-start justify-between gap-4">
              <span className="text-xl font-bold">{move.name}</span>
              <Button isIconOnly size="sm" variant="outline" onPress={onClose} aria-label="Close">
                <FaXmark size={14} />
              </Button>
            </Modal.Header>
            <Modal.Body>
              <AnimationPlayerProvider
                move={move}
                characterName={character.name}
                showAdditionalControls={false}
                apngUrl={move.pngUrl ?? undefined}
              >
                <Surface className="border-border overflow-hidden rounded-xl border" variant="secondary">
                  <div className="border-border flex items-center border-b px-4 py-3">
                    <span className="text-muted-foreground font-semibold">Hitbox Viewer</span>
                  </div>
                  {move.animationCredit && (
                    <Surface className="border-border border-b px-4 py-2">
                      <AnimationCredit credit={move.animationCredit} />
                    </Surface>
                  )}
                  <div className="w-full">
                    <AnimationDisplay />
                  </div>
                  <div className="border-border border-t px-4 pt-3 pb-4">
                    <AnimationPlayerControls />
                  </div>
                </Surface>
              </AnimationPlayerProvider>
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
        <div
          className="group relative cursor-pointer"
          onClick={(event) => {
            event.stopPropagation();
            setIsOpen(true);
            createEvent('preview-video-open', { character: params.character.name, move: params.move.name });
          }}
        >
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

      <Lightbox move={params.move} character={params.character} isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
