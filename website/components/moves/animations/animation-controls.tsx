import { HitChips } from '@/components/moves/animations/controls/hit-chips';
import HitboxTimeline from '@/components/moves/hitboxes/hitbox-timeline';
import { Move } from '@/models/move';
import { createEvent } from '@/utilities/create-event';
import { Button, ToggleButton, ToggleButtonGroup } from '@heroui/react';
import { FaBackward, FaBackwardStep, FaForward, FaForwardStep, FaPause, FaPlay } from 'react-icons/fa6';

export interface AnimationControlsProps {
  frameCounter: number;
  totalFrames: number;
  isPlaying: boolean;
  playbackSpeed?: number;
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
  playbackSpeed = 0.2,
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
    <div className="flex flex-col">
      {/* Frame counter + FPS */}
      <div className="mb-3 flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-baseline gap-1.5">
          <span className="font-mono text-[30px] font-semibold leading-none text-foreground">{frameCounter}</span>
          <span className="font-mono text-xs text-muted-foreground">/ {totalFrames > 0 ? totalFrames : '—'}</span>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <span className="mr-1.5 text-xs text-muted-foreground">FPS</span>
          <ToggleButtonGroup
            isDetached
            selectionMode="single"
            size="sm"
            selectedKeys={[String(playbackSpeed)]}
            isDisabled={!showPlaybackSpeed}
            onSelectionChange={(key) => {
              const first = [...key][0];
              const speed = Number(first);
              onPlaybackSpeedChange?.(speed);
              createEvent('change_speed', { speed });
            }}
          >
            <ToggleButton id="0.2">12</ToggleButton>
            <ToggleButton id="0.5">30</ToggleButton>
            <ToggleButton id="1">60</ToggleButton>
          </ToggleButtonGroup>
        </div>
      </div>

      {/* Hit chips legend */}
      <div className="mb-2">
        <HitChips move={move} />
      </div>

      {/* Timeline */}
      <HitboxTimeline interactive move={move} />

      {/* Transport controls */}
      <div className="flex w-full items-center justify-center gap-2 pt-3">
        <Button isIconOnly variant="tertiary" onPress={onGoToFirstFrame}>
          <FaBackwardStep />
        </Button>
        <Button isIconOnly variant="tertiary" onPress={previousFrame}>
          <FaBackward />
        </Button>
        {isPlaying ? (
          <Button
            size="lg"
            isIconOnly
            className="shadow-[0_4px_16px_rgba(185,28,28,0.35)]"
            onPress={onPause}
          >
            <FaPause />
          </Button>
        ) : (
          <Button
            size="lg"
            isIconOnly
            className="shadow-[0_4px_16px_rgba(185,28,28,0.35)]"
            onPress={onPlay}
          >
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
  );
};
