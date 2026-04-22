import { AnimationPlayer } from '@/components/moves/animations/animation-player';
import { DownloadButtonGroup } from '@/components/moves/download-button-group';
import { Move } from '@/models/move';
import { createEvent } from '@/utilities/create-event';
import { Button, ListBox, ListBoxItem, Modal, Select } from '@heroui/react';
import { useState } from 'react';
import { FaExpand } from 'react-icons/fa6';
import { MoveGif } from './animations/move-gif';

export interface MoveAnimationDisplayParams {
  move: Move;
  characterName: string;
}

export default function MoveAnimationDisplay(params: Readonly<MoveAnimationDisplayParams>) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  if (!params.move.pngUrl && (!params.move.alternativeAnimations || params.move.alternativeAnimations.length === 0)) {
    if (params.move.gifUrl) {
      return <MoveGif move={params.move} characterName={params.characterName} />;
    }
    return <em>There is no GIF available</em>;
  }

  const handleDownloadClick = async (image: string, format: string) => {
    createEvent('download-image', { image, format });
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
        <Button
          variant="tertiary"
          className="hidden md:inline-flex"
          isIconOnly
          aria-label="fullscreen"
          onPress={() => setIsOpen(true)}
        >
          <FaExpand />
        </Button>
        {hasMultipleAnimations && (
          <Select
            selectedKey={currentPage.toString()}
            onSelectionChange={(key) => {
              const k = key as string;
              if (!k) {
                setCurrentPage(1);
                return;
              }
              setCurrentPage(Number(k));
            }}
            aria-label="Animation selection"
          >
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                {descriptionArray.slice(1).map((description, index) => (
                  <ListBoxItem key={(index + 1).toString()} id={(index + 1).toString()} textValue={description ?? ''}>
                    {description}
                  </ListBoxItem>
                ))}
              </ListBox>
            </Select.Popover>
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
        onOpenChange={setIsOpen}
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
    <Modal.Root isOpen={params.isOpen} onOpenChange={params.onOpenChange}>
      <Modal.Backdrop>
        <Modal.Container size="full">
          <Modal.Dialog>
            <Modal.Header className="flex flex-col gap-1">{params.move.name}</Modal.Header>
            <Modal.Body>
              <AnimationPlayer
                move={params.move}
                characterName={params.characterName}
                apngUrl={params.specificUrl ? params.specificUrl : params.move.pngUrl!}
                showAdditionalControls={true}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button onPress={() => params.onOpenChange(false)}>Close</Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal.Root>
  );
}
