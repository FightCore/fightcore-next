import { HitChips } from '@/components/moves/animations/controls/hit-chips';
import HitboxTimeline from '@/components/moves/hitboxes/hitbox-timeline';
import { Move } from '@/models/move';
import { createEvent } from '@/utilities/create-event';
import { Button, ToggleButton, ToggleButtonGroup, Tooltip } from '@heroui/react';
import { FaBackward, FaBackwardStep, FaForward, FaForwardStep, FaPause, FaPlay } from 'react-icons/fa6';

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
  move: Move;
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
  move,
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
    <div>
      <div className="flex w-full justify-between">
        {frameCounter} / {totalFrames > 0 && `of ${totalFrames}`}
        <div className="flex gap-2">
          FPS
          <ToggleButtonGroup
            isDetached
            selectionMode="single"
            size="sm"
            defaultSelectedKeys={['0.2']}
            isDisabled={!showPlaybackSpeed}
            onSelectionChange={(key) => {
              const first = [...key][0];
              const speed = Number(first);
              onPlaybackSpeedChange?.(speed);
              createEvent('change_speed', { speed });
            }}
          >
            <ToggleButton id="0.2"> 12 </ToggleButton>
            <ToggleButton id="0.5"> 30</ToggleButton>
            <ToggleButton id="1"> 60</ToggleButton>
          </ToggleButtonGroup>
        </div>
      </div>
      <div className="border-black-800 my-2 border-y py-2">
        <HitChips move={move}></HitChips>
      </div>
      <HitboxTimeline interactive move={move}></HitboxTimeline>
      <div className="flex w-full place-content-center">
        <div className="flex gap-3">
          <Button isIconOnly variant="tertiary" onPress={onGoToFirstFrame}>
            <FaBackwardStep />
          </Button>
          <Button isIconOnly variant="tertiary" onPress={previousFrame}>
            <FaBackward />
          </Button>
          {isPlaying ? (
            <Button size="lg" isIconOnly onPress={onPause}>
              <FaPause />
            </Button>
          ) : (
            <Button size="lg" isIconOnly onPress={onPlay}>
              <FaPlay />
            </Button>
          )}
          <Button isIconOnly variant="tertiary" onPress={nextFrame}>
            <FaForward />
          </Button>
          <Button isIconOnly variant="tertiary" onPress={onGoToLastFrame}>
            <FaForwardStep />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Tooltip>
          <Tooltip.Trigger>
            <Button variant="tertiary" className="w-full" isDisabled>
              Report issue
            </Button>
          </Tooltip.Trigger>
          <Tooltip.Content>Feature coming soon</Tooltip.Content>
        </Tooltip>
      </div>
    </div>
  );
};
