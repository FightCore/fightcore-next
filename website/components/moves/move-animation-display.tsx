import { AnimationDisplay } from '@/components/moves/animations/animation-display';
import { AnimationPlayer } from '@/components/moves/animations/animation-player';
import { AnimationPlayerProvider } from '@/components/moves/animations/animation-player-context';
import { AnimationPlayerControls } from '@/components/moves/animations/animation-player-controls';
import { AnimationCredit } from '@/components/moves/animations/controls/animation-credit';
import { AnimationPicker } from '@/components/moves/animations/controls/animation-picker';
import { DownloadButtonGroup } from '@/components/moves/download-button-group';
import { Move } from '@/models/move';
import { createEvent } from '@/utilities/create-event';
import { Button, Modal, Surface } from '@heroui/react';
import { useState } from 'react';
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
    <AnimationPlayerProvider
      move={params.move}
      characterName={params.characterName}
      showAdditionalControls={false}
      apngUrl={currentUrl}
    >
      <Surface className="border-border overflow-hidden rounded-xl border" variant="secondary">
        {/* Header */}
        <div className="border-border flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground font-semibold">Hitbox Viewer</span>
            {hasMultipleAnimations && (
              <AnimationPicker descriptions={descriptionArray} onChange={(key: number) => setCurrentPage(key)} />
            )}
          </div>
          <DownloadButtonGroup
            isDownloading={isDownloading}
            onDownloadGif={() => handleDownloadClick(currentAnimation.gifUrl!, 'gif')}
            onDownloadPng={() => handleDownloadClick(currentAnimation.pngUrl!, 'png')}
            onDownloadWebm={() => handleDownloadClick(currentAnimation.webmUrl!, 'webm')}
          />
        </div>

        {/* Credit */}
        {params.move.animationCredit && (
          <Surface className="border-border border-b px-4 py-2">
            <AnimationCredit credit={params.move.animationCredit} />
          </Surface>
        )}

        {/* Animation display */}
        <div className="w-full sm:px-40">
          <AnimationDisplay />
          <FullScreenModal
            isOpen={isOpen}
            onOpenChange={setIsOpen}
            move={params.move}
            characterName={params.characterName}
            specificUrl={currentUrl}
          />
        </div>

        {/* Controls */}
        <div className="border-border border-t px-4 pt-3 pb-4">
          <AnimationPlayerControls />
        </div>
      </Surface>
    </AnimationPlayerProvider>
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
