'use client';

import { Move } from '@/models/move';
import { Button } from '@heroui/button';
import { Image } from '@heroui/image';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@heroui/modal';
import ApngMove from './apng-move-gif';
import { MoveGif } from './move-gif';

export interface PreviewVideoParams {
  move: Move;
  characterName: string;
  lazy: boolean;
}

export function PreviewVideo(params: Readonly<PreviewVideoParams>) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const isIOS = () => {
    return navigator && /iPhone|iPad|iPod/i.test(navigator.userAgent);
  };
  const getPlayer = () => {
    if (!params.move.webmUrl || (isIOS() && !params.move.gifUrl)) {
      return <em>There is no GIF available</em>;
    }

    if (isIOS() && params.move.gifUrl) {
      return (
        <Image
          className="cursor-pointer"
          onClick={onOpen}
          src={params.move.gifUrl}
          alt={params.characterName + ' ' + params.move.name}
          width={600}
          height={300}
          loading={params.lazy ? undefined : 'eager'}
        />
      );
    }

    return (
      <video
        className="cursor-pointer"
        onClick={onOpen}
        muted
        playsInline
        autoPlay
        loop
        width={600}
        height={400}
        src={params.move.webmUrl}
      />
    );
  };

  return (
    <>
      {getPlayer()}
      <Modal size="5xl" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{params.move.name}</ModalHeader>
              <ModalBody>
                {isIOS() ? (
                  <MoveGif characterName={params.characterName} move={params.move} />
                ) : (
                  <ApngMove showAdditionalControls={true} url={params.move.pngUrl!} />
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
