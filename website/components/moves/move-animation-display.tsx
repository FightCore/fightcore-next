import { AnimationPlayer } from '@/components/moves/animations/animation-player';
import { DownloadButtonGroup } from '@/components/moves/download-button-group';
import { Move } from '@/models/move';
import { Button } from '@heroui/button';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@heroui/modal';
import { Select, SelectItem } from '@heroui/select';
import { useState } from 'react';
import { FaExpand } from 'react-icons/fa6';
import { MoveGif } from './animations/move-gif';

export interface MoveAnimationDisplayParams {
  move: Move;
  characterName: string;
}

export default function MoveAnimationDisplay(params: Readonly<MoveAnimationDisplayParams>) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isDownloading, setIsDownloading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  if (!params.move.pngUrl && (!params.move.alternativeAnimations || params.move.alternativeAnimations.length === 0)) {
    if (params.move.gifUrl) {
      return <MoveGif move={params.move} characterName={params.characterName} />;
    }
    return <em>There is no GIF available</em>;
  }

  const handleDownloadClick = async (image: string, format: string) => {
    setIsDownloading(true);
    try {
      const response = await fetch(image);

      if (response.status !== 200) {
        console.error(response.status, response.statusText);
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = params.move.normalizedName + '.' + format;
      link.click();
    } finally {
      setIsDownloading(false);
    }
  };

  const urlArray = [
    'invalid',
    params.move.pngUrl,
    ...params.move.alternativeAnimations!.map((animation) => animation.pngUrl),
  ];
  const descriptionArray = [
    'invalid',
    'Regular',
    ...params.move.alternativeAnimations!.map((animation) => animation.description),
  ];

  const animationArray = [undefined, params.move, ...params.move.alternativeAnimations!];

  if (!params.move.pngUrl) {
    urlArray.splice(1, 1);
    descriptionArray.splice(1, 1);
    animationArray.splice(1, 1);
  }

  const hasMultipleAnimations = params.move.alternativeAnimations && params.move.alternativeAnimations.length > 0;
  const currentAnimation = animationArray[currentPage] ?? params.move;
  const currentUrl = urlArray[currentPage] ?? params.move.pngUrl;

  return (
    <>
      <div className="flex items-end justify-between gap-2">
        <Button isIconOnly className="hidden md:inline-flex" aria-label="fullscreen" onPress={onOpen}>
          <FaExpand />
        </Button>
        {hasMultipleAnimations && (
          <Select
            selectedKeys={currentPage.toString()}
            onSelectionChange={(keys) => {
              console.log(keys);
              if (keys instanceof Set && keys.size === 0) {
                setCurrentPage(1);
                return;
              }
              setCurrentPage(Number(Array.from(keys)[0]));
            }}
          >
            {descriptionArray.slice(1).map((description, index) => (
              <SelectItem key={(index + 1).toString()}>{description}</SelectItem>
            ))}
          </Select>
        )}
        <DownloadButtonGroup
          isDownloading={isDownloading}
          onDownloadGif={() => handleDownloadClick(currentAnimation.gifUrl!, 'gif')}
          onDownloadPng={() => handleDownloadClick(currentAnimation.pngUrl!, 'png')}
          onDownloadWebm={() => handleDownloadClick(currentAnimation.webmUrl!, 'webm')}
        />
      </div>
      <AnimationPlayer
        key={'gif' + currentPage}
        move={params.move}
        characterName={params.characterName}
        apngUrl={currentUrl}
      />
      <FullScreenModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        move={params.move}
        characterName={params.characterName}
        specificUrl={currentUrl}
      />
    </>
  );
}

interface MoveAnimationModalParams extends MoveAnimationDisplayParams {
  onOpenChange: (isOpen: boolean) => void;
  isOpen: boolean | undefined;
  specificUrl?: string;
}

function FullScreenModal(params: Readonly<MoveAnimationModalParams>) {
  return (
    <Modal size="5xl" isOpen={params.isOpen} onOpenChange={params.onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">{params.move.name}</ModalHeader>
            <ModalBody>
              <AnimationPlayer
                move={params.move}
                characterName={params.characterName}
                apngUrl={params.specificUrl ? params.specificUrl : params.move.pngUrl!}
                showAdditionalControls={true}
              />
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
  );
}
