import { Button, ButtonGroup } from '@heroui/button';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/dropdown';
import { Progress } from '@heroui/progress';
import { FaAngleDown } from 'react-icons/fa6';

export interface DownloadButtonGroupProps {
  isDownloading: boolean;
  onDownloadGif: () => Promise<void>;
  onDownloadPng: () => Promise<void>;
  onDownloadWebm: () => Promise<void>;
}

export function DownloadButtonGroup(props: Readonly<DownloadButtonGroupProps>) {
  const { isDownloading, onDownloadGif, onDownloadPng, onDownloadWebm } = props;

  return (
    <ButtonGroup variant="flat">
      {isDownloading ? (
        <Button isDisabled>
          <Progress isIndeterminate aria-label="Loading..." className="w-16" size="sm" />
        </Button>
      ) : (
        <Button disabled={isDownloading} onPress={onDownloadGif}>
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
          aria-label="Download format options"
          className="max-w-[300px]"
          selectionMode="single"
        >
          <DropdownItem key="gif" onPress={onDownloadGif}>
            GIF
          </DropdownItem>
          <DropdownItem key="png" onPress={onDownloadPng}>
            PNG
          </DropdownItem>
          <DropdownItem key="webm" onPress={onDownloadWebm}>
            WEBM
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </ButtonGroup>
  );
}
