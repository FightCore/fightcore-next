'use client';

import { Move } from '@/models/move';
import { Button, Modal, Popover } from '@heroui/react';
import { useEffect, useState } from 'react';
import { FaCircleQuestion } from 'react-icons/fa6';
import { AnimationLegendContent } from './animation-legend';
import ApngMove from './apng-move-gif';
import { MoveGif } from './move-gif';

export interface PreviewVideoParams {
  move: Move;
  characterName: string;
  lazy: boolean;
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
          className="w-full cursor-pointer bg-zinc-300 dark:bg-transparent"
          onClick={() => setIsOpen(true)}
          src={params.move.gifUrl}
          alt={params.characterName + ' ' + params.move.name}
          loading={params.lazy ? 'lazy' : 'eager'}
        />
      );
    }

    return (
      <video
        className="w-full cursor-pointer bg-zinc-300 dark:bg-transparent"
        onClick={() => setIsOpen(true)}
        muted
        playsInline
        autoPlay
        loop
        src={params.move.webmUrl}
      />
    );
  };

  return (
    <>
      <div className="relative w-72 max-w-full min-w-64">
        {getPlayer()}
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
      <Modal.Root isOpen={isOpen} onOpenChange={setIsOpen}>
        <Modal.Backdrop>
          <Modal.Container size="full">
            <Modal.Dialog>
              <Modal.Header className="flex flex-col gap-1">{params.move.name}</Modal.Header>
              <Modal.Body>
                {isIOS ? (
                  <MoveGif characterName={params.characterName} move={params.move} />
                ) : (
                  <ApngMove showAdditionalControls={true} url={params.move.pngUrl!} />
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button onPress={() => setIsOpen(false)}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal.Root>
    </>
  );
}
