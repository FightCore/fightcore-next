import { createEvent } from '@/utilities/create-event';
import { Button, ListBox, ListBoxItem, Select, Tooltip } from '@heroui/react';

export interface AnimationControlsProps {
  frameCounter: number;
  totalFrames: number;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNextFrame: () => void;
  onPreviousFrame: () => void;
  onGoToFrame?: (frameNumber: number) => void;
  showPlaybackSpeed?: boolean;
  onPlaybackSpeedChange?: (speed: number) => void;
  showFirstLastButtons?: boolean;
  onGoToFirstFrame?: () => void;
  onGoToLastFrame?: () => void;
}

export const AnimationControls = ({
  frameCounter,
  totalFrames,
  isPlaying,
  onPlay,
  onPause,
  onNextFrame,
  onPreviousFrame,
  showPlaybackSpeed = false,
  onPlaybackSpeedChange,
  showFirstLastButtons = false,
  onGoToFirstFrame,
  onGoToLastFrame,
}: AnimationControlsProps) => {
  const nextFrame = () => {
    onPause();
    onNextFrame();
  };

  const previousFrame = () => {
    onPause();
    onPreviousFrame();
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      {isPlaying ? (
        <Button variant="tertiary" className="w-full" onPress={onPause} aria-label="Pause animation">
          <kbd className="mr-1 text-xs opacity-60">Space</kbd> Pause
        </Button>
      ) : (
        <Button variant="tertiary" className="w-full" onPress={onPlay} aria-label="Play animation">
          <kbd className="mr-1 text-xs opacity-60">Space</kbd> Play
        </Button>
      )}

      <Button variant="tertiary" className="w-full" aria-label="Frame counter">
        Frame: {frameCounter} {totalFrames > 0 && `of ${totalFrames}`}
      </Button>

      <Button variant="tertiary" className="w-full" onPress={previousFrame} aria-label="Previous frame">
        <kbd className="mr-1 text-xs opacity-60">←</kbd> Previous Frame
      </Button>

      <Button variant="tertiary" className="w-full" onPress={nextFrame} aria-label="Next frame">
        <kbd className="mr-1 text-xs opacity-60">→</kbd> Next Frame
      </Button>

      <Select
        className="w-full"
        defaultSelectedKey="0.2"
        isDisabled={!showPlaybackSpeed}
        onSelectionChange={(key) => {
          const speed = Number(key);
          onPlaybackSpeedChange?.(speed);
          createEvent('change_speed', { speed });
        }}
        aria-label="Playback speed"
      >
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            <ListBoxItem id="0.2" textValue="12 FPS (Default)">
              12 FPS (Default)
            </ListBoxItem>
            <ListBoxItem id="1" textValue="60 FPS (In-game speed)">
              60 FPS (In-game speed)
            </ListBoxItem>
          </ListBox>
        </Select.Popover>
      </Select>

      <Tooltip>
        <Tooltip.Trigger>
          <Button variant="tertiary" className="w-full" isDisabled>
            Report issue
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content>Feature coming soon</Tooltip.Content>
      </Tooltip>

      {showFirstLastButtons && (
        <Button variant="tertiary" className="w-full" onPress={onGoToFirstFrame} aria-label="First frame">
          First Frame
        </Button>
      )}

      {showFirstLastButtons && (
        <Button variant="tertiary" className="w-full" onPress={onGoToLastFrame} aria-label="Last frame">
          Last Frame
        </Button>
      )}
    </div>
  );
};
