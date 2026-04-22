import { Button, ButtonGroup, Dropdown } from '@heroui/react';
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
    <ButtonGroup variant="tertiary">
      {isDownloading ? (
        <Button isDisabled variant="tertiary">
          <span className="animate-pulse">Downloading...</span>
        </Button>
      ) : (
        <Button variant="tertiary" isDisabled={isDownloading} onPress={onDownloadGif}>
          Download GIF
        </Button>
      )}
      <Dropdown.Root>
          <Dropdown.Trigger isDisabled={isDownloading} className="button button--tertiary px-3">
            <FaAngleDown />
          </Dropdown.Trigger>
          <Dropdown.Popover placement="bottom end">
            <Dropdown.Menu
              disallowEmptySelection
              aria-label="Download format options"
              className="max-w-75"
              selectionMode="single"
            >
              <Dropdown.Item id="gif" textValue="GIF" onAction={onDownloadGif}>
                GIF
              </Dropdown.Item>
              <Dropdown.Item id="png" textValue="PNG" onAction={onDownloadPng}>
                PNG
              </Dropdown.Item>
              <Dropdown.Item id="webm" textValue="WEBM" onAction={onDownloadWebm}>
                WEBM
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown.Popover>
        </Dropdown.Root>
    </ButtonGroup>
  );
}
