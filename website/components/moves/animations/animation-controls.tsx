import { HitChips } from '@/components/moves/animations/controls/hit-chips';
import HitboxTimeline from '@/components/moves/hitboxes/hitbox-timeline';
import { Move } from '@/models/move';
import { createEvent } from '@/utilities/create-event';
import { Button, ToggleButton, ToggleButtonGroup } from '@heroui/react';
import { useEffect, useRef } from 'react';
import { FaBackward, FaBackwardStep, FaForward, FaForwardStep, FaPause, FaPlay } from 'react-icons/fa6';

export interface AnimationControlsProps {
  frameCounter: number;
  totalFrames: number;
  isPlaying: boolean;
  isLoaded?: boolean;
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
  isLoaded = true,
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
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const holdIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchActiveRef = useRef(false);

  const nextFrame = () => {
    onPause();
    onNextFrame();
  };

  const previousFrame = () => {
    onPause();
    onPreviousFrame();
  };

  const stopNextFrameHold = () => {
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    holdTimerRef.current = null;
    holdIntervalRef.current = null;
    setTimeout(() => {
      touchActiveRef.current = false;
    }, 50);
  };

  const handleNextFrameTouchStart = () => {
    touchActiveRef.current = true;
    nextFrame();
    holdTimerRef.current = setTimeout(() => {
      holdIntervalRef.current = setInterval(nextFrame, 100);
    }, 400);
  };

  const handlePreviousFrameTouchStart = () => {
    touchActiveRef.current = true;
    previousFrame();
    holdTimerRef.current = setTimeout(() => {
      holdIntervalRef.current = setInterval(previousFrame, 100);
    }, 400);
  };

  useEffect(() => () => stopNextFrameHold(), []);

  return (
    <div className="flex flex-col">
      {/* Frame counter + FPS */}
      <div className="border-border mb-3 flex items-center justify-between border-b pb-3">
        <div className="flex items-baseline gap-1.5">
          <span className="text-foreground font-mono text-[30px] leading-none font-semibold">{frameCounter}</span>
          <span className="text-muted-foreground font-mono text-xs">/ {totalFrames > 0 ? totalFrames : '—'}</span>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <span className="text-muted-foreground mr-1.5 text-xs">FPS</span>
          <ToggleButtonGroup
            isDetached
            selectionMode="single"
            size="sm"
            selectedKeys={[String(playbackSpeed)]}
            isDisabled={!showPlaybackSpeed || !isLoaded}
            onSelectionChange={(key) => {
              let first = [...key][0];

              // Prevent the user from deselecting the FPS, this would crash the player.
              if (!first) {
                first = '0.2';
              }

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
        <Button isIconOnly isDisabled={!isLoaded} variant="tertiary" onPress={onGoToFirstFrame}>
          <FaBackwardStep />
        </Button>
        <Button
          isIconOnly
          isDisabled={!isLoaded}
          variant="tertiary"
          onPress={() => {
            if (!touchActiveRef.current) previousFrame();
          }}
          onTouchStart={handlePreviousFrameTouchStart}
          onTouchEnd={stopNextFrameHold}
          onTouchCancel={stopNextFrameHold}
        >
          <FaBackward />
        </Button>
        {isPlaying ? (
          <Button size="lg" isIconOnly isDisabled={!isLoaded} className="shadow-[0_4px_16px_rgba(185,28,28,0.35)]" onPress={onPause}>
            <FaPause />
          </Button>
        ) : (
          <Button size="lg" isIconOnly isDisabled={!isLoaded} className="shadow-[0_4px_16px_rgba(185,28,28,0.35)]" onPress={onPlay}>
            <FaPlay />
          </Button>
        )}
        <Button
          isIconOnly
          isDisabled={!isLoaded}
          variant="tertiary"
          onPress={() => {
            if (!touchActiveRef.current) nextFrame();
          }}
          onTouchStart={handleNextFrameTouchStart}
          onTouchEnd={stopNextFrameHold}
          onTouchCancel={stopNextFrameHold}
        >
          <FaForward />
        </Button>
        <Button isIconOnly isDisabled={!isLoaded} variant="tertiary" onPress={onGoToLastFrame}>
          <FaForwardStep />
        </Button>
      </div>
    </div>
  );
};
