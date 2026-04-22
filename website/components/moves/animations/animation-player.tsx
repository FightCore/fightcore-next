import eventEmitter from '@/events/event-emitter';
import { Move } from '@/models/move';
import { createEvent } from '@/utilities/create-event';
import { useCallback, useEffect, useState } from 'react';
import { AnimationControls } from './animation-controls';
import ApngMove from './apng-move-gif';
import { MoveGif } from './move-gif';

interface AnimationPlayerProps {
  move: Move;
  characterName: string;
  showAdditionalControls?: boolean;
  apngUrl?: string;
  preferGif?: boolean;
}

/**
 * Parent component that manages player selection and provides unified controls
 * - Uses APNG by default if available
 * - Falls back to GIF player on iOS or if APNG fails
 * - Provides a single AnimationControls component for both players
 * - Uses event emitter for player control communication
 */
export const AnimationPlayer = ({
  move,
  characterName,
  showAdditionalControls = false,
  apngUrl,
  preferGif = false,
}: AnimationPlayerProps) => {
  const [frameCounter, setFrameCounter] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [totalFrames, setTotalFrames] = useState(0);
  const [useGif, setUseGif] = useState(preferGif);

  // Detect iOS or force GIF
  useEffect(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS || preferGif) {
      setUseGif(true);
    }
  }, [preferGif]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Skip if user is typing in an input, textarea, or contenteditable element
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      if (event.key === ' ') {
        if (isPlaying) {
          handlePause();
        } else {
          handlePlay();
        }
        event.preventDefault();
      } else if (event.key === 'ArrowRight') {
        createEvent('arrow-right-gif', { apngUrl });
        handleNextFrame();
      } else if (event.key === 'ArrowLeft') {
        createEvent('arrow-left-gif', { apngUrl });
        handlePreviousFrame();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying]);

  useEffect(() => {
    eventEmitter.on('frameCounterUpdate', setFrameCounter);
    eventEmitter.on('totalFramesUpdate', setTotalFrames);
    eventEmitter.on('seek', (frameNumber: number) => {
      setIsPlaying(false);
    });

    return () => {
      eventEmitter.off('frameCounterUpdate', setFrameCounter);
      eventEmitter.off('totalFramesUpdate', setTotalFrames);
      eventEmitter.off('seek', (frameNumber: number) => {
        setIsPlaying(false);
      });
      eventEmitter.emit('pause');
    };
  }, []);

  const handlePlay = useCallback(() => {
    eventEmitter.emit('play');
    setIsPlaying(true);
  }, []);

  const handlePause = useCallback(() => {
    createEvent('pause-gif', { apngUrl });
    eventEmitter.emit('pause');
    setIsPlaying(false);
  }, []);

  const handleNextFrame = useCallback(() => {
    eventEmitter.emit('nextFrame');
  }, []);

  const handlePreviousFrame = useCallback(() => {
    eventEmitter.emit('previousFrame');
  }, []);

  const handleGoToFrame = useCallback((frameNumber: number) => {
    createEvent('seek-gif', { frameNumber, apngUrl });
    eventEmitter.emit('seek', frameNumber);
  }, []);

  const handlePlaybackSpeedChange = useCallback((speed: number) => {
    eventEmitter.emit('setPlaybackSpeed', speed);
  }, []);

  const handleApngError = useCallback(() => {
    createEvent('failover-gif', { apngUrl });
    setUseGif(true);
  }, []);

  return (
    <>
      {useGif ? (
        <MoveGif move={move} characterName={characterName} />
      ) : (
        <ApngMove
          url={apngUrl || move.pngUrl!}
          showAdditionalControls={showAdditionalControls}
          onError={handleApngError}
        />
      )}

      <AnimationControls
        frameCounter={frameCounter}
        totalFrames={totalFrames}
        isPlaying={isPlaying}
        onPlay={handlePlay}
        onPause={handlePause}
        onNextFrame={handleNextFrame}
        onPreviousFrame={handlePreviousFrame}
        onGoToFrame={handleGoToFrame}
        showPlaybackSpeed={!useGif}
        onPlaybackSpeedChange={handlePlaybackSpeedChange}
        showFirstLastButtons={showAdditionalControls}
        onGoToFirstFrame={() => handleGoToFrame(1)}
        onGoToLastFrame={() => {
          if (totalFrames > 0) {
            handleGoToFrame(totalFrames);
          }
        }}
      />
    </>
  );
};
