import { Move } from '@/models/move';
import { Button, ButtonGroup } from '@heroui/button';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/dropdown';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@heroui/modal';
import { Pagination } from '@heroui/pagination';
import { Progress } from '@heroui/progress';
import { useState } from 'react';
import { FaAngleDown, FaExpand } from 'react-icons/fa6';
import ApngMove from './animations/apng-move-gif';
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

  const expandButton = (
    <Button isIconOnly className="hidden md:inline-flex" aria-label="fullscreen" onPress={onOpen}>
      <FaExpand />
    </Button>
  );

  const handleDownloadClick = async (image: string, format: string) => {
    setIsDownloading(true);
    const response = await fetch(image);

    if (response.status !== 200) {
      setIsDownloading(false);
      console.error(response.status, response.statusText);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = params.move.normalizedName + '.' + format;
    link.click();
    setIsDownloading(false);
  };

  const downloadDropdownButton = (
    <ButtonGroup variant="flat">
      {isDownloading ? (
        <Button isDisabled={isDownloading}>
          <Progress isIndeterminate aria-label="Loading..." className="w-16" size="sm" />
        </Button>
      ) : (
        <Button disabled={isDownloading} onPress={async () => await handleDownloadClick(params.move.gifUrl!, 'gif')}>
          Download GIF
        </Button>
      )}
      <Dropdown isDisabled={isDownloading} placement="bottom-end">
        <DropdownTrigger>
          <Button isIconOnly>
            <FaAngleDown />
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          disallowEmptySelection
          aria-label="Merge options"
          className="max-w-[300px]"
          selectionMode="single"
        >
          <DropdownItem key="merge" onPress={async () => await handleDownloadClick(params.move.gifUrl!, 'gif')}>
            GIF
          </DropdownItem>
          <DropdownItem key="squash" onPress={async () => await handleDownloadClick(params.move.pngUrl!, 'png')}>
            PNG
          </DropdownItem>
          <DropdownItem key="rebase" onPress={async () => await handleDownloadClick(params.move.webmUrl!, 'webm')}>
            WEBM
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </ButtonGroup>
  );

  if ((!params.move.alternativeAnimations || params.move.alternativeAnimations.length === 0) && params.move.pngUrl) {
    return (
      <div>
        {expandButton}
        <div className="float-right">{downloadDropdownButton}</div>
        <ApngMove url={params.move.pngUrl} />
        <FullScreenModal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          move={params.move}
          characterName={params.characterName}
        />
      </div>
    );
  }

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

  const downloadCurrentGifDropdownButton = (
    <ButtonGroup variant="flat">
      {isDownloading ? (
        <Button isDisabled={isDownloading}>
          <Progress isIndeterminate aria-label="Loading..." className="w-16" size="sm" />
        </Button>
      ) : (
        <Button
          disabled={isDownloading}
          onPress={async () => await handleDownloadClick(animationArray[currentPage]!.gifUrl!, 'gif')}
        >
          Download GIF
        </Button>
      )}
      <Dropdown isDisabled={isDownloading} placement="bottom-end">
        <DropdownTrigger>
          <Button isIconOnly>
            <FaAngleDown />
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          disallowEmptySelection
          aria-label="Merge options"
          className="max-w-[300px]"
          selectionMode="single"
        >
          <DropdownItem
            key="merge"
            onPress={async () => await handleDownloadClick(animationArray[currentPage]!.gifUrl!, 'gif')}
          >
            GIF
          </DropdownItem>
          <DropdownItem
            key="squash"
            onPress={async () => await handleDownloadClick(animationArray[currentPage]!.pngUrl!, 'png')}
          >
            PNG
          </DropdownItem>
          <DropdownItem
            key="rebase"
            onPress={async () => await handleDownloadClick(animationArray[currentPage]!.webmUrl!, 'webm')}
          >
            WEBM
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </ButtonGroup>
  );

  return (
    <>
      <span className="block" key={'url' + currentPage}>
        {descriptionArray[currentPage]}
      </span>
      <Pagination
        total={urlArray.length - 1}
        color="secondary"
        page={currentPage}
        onChange={setCurrentPage}
        className="inline-flex w-2/3"
      />
      {expandButton}
      <div className="float-right">{downloadCurrentGifDropdownButton}</div>

      <ApngMove key={'gif' + currentPage} url={urlArray[currentPage]!} />
      <FullScreenModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        move={params.move}
        characterName={params.characterName}
        specificUrl={urlArray[currentPage]}
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
              <ApngMove
                showAdditionalControls={true}
                url={params.specificUrl ? params.specificUrl : params.move.pngUrl!}
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
