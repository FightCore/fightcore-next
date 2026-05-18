import eventEmitter from '@/events/event-emitter';
import { Move } from '@/models/move';
import { createEvent } from '@/utilities/create-event';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

interface AnimationPlayerContextValue {
  frameCounter: number;
  isPlaying: boolean;
  isLoaded: boolean;
  totalFrames: number;
  playbackSpeed: number;
  useGif: boolean;
  move: Move;
  characterName: string;
  showAdditionalControls: boolean;
  apngUrl?: string;
  onPlay: () => void;
  onPause: () => void;
  onNextFrame: () => void;
  onPreviousFrame: () => void;
  onGoToFrame: (frameNumber: number) => void;
  onPlaybackSpeedChange: (speed: number) => void;
  onApngError: () => void;
}

const AnimationPlayerContext = createContext<AnimationPlayerContextValue | null>(null);

export const useAnimationPlayer = () => {
  const ctx = useContext(AnimationPlayerContext);
  if (!ctx) throw new Error('useAnimationPlayer must be used within AnimationPlayerProvider');
  return ctx;
};

export interface AnimationPlayerProviderProps {
  move: Move;
  characterName: string;
  showAdditionalControls?: boolean;
  apngUrl?: string;
  preferGif?: boolean;
  children: React.ReactNode;
}

export const AnimationPlayerProvider = ({
  move,
  characterName,
  showAdditionalControls = false,
  apngUrl,
  preferGif = false,
  children,
}: AnimationPlayerProviderProps) => {
  const [frameCounter, setFrameCounter] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [totalFrames, setTotalFrames] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(0.2);
  const [useGif, setUseGif] = useState(preferGif);

  useEffect(() => {
    setIsPlaying(true);
    setFrameCounter(1);
    setTotalFrames(0);
    setPlaybackSpeed(0.2);
    eventEmitter.emit('play');
  }, [apngUrl]);

  useEffect(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS || preferGif) {
      setUseGif(true);
    }
  }, [preferGif]);

  const handlePlay = useCallback(() => {
    eventEmitter.emit('play');
    setIsPlaying(true);
  }, []);

  const handlePause = useCallback(() => {
    createEvent('pause-gif', { apngUrl });
    eventEmitter.emit('pause');
    setIsPlaying(false);
  }, [apngUrl]);

  const handleNextFrame = useCallback(() => {
    eventEmitter.emit('nextFrame');
  }, []);

  const handlePreviousFrame = useCallback(() => {
    eventEmitter.emit('previousFrame');
  }, []);

  const handleGoToFrame = useCallback(
    (frameNumber: number) => {
      createEvent('seek-gif', { frameNumber, apngUrl });
      eventEmitter.emit('seek', frameNumber);
    },
    [apngUrl],
  );

  const handlePlaybackSpeedChange = useCallback((speed: number) => {
    setPlaybackSpeed(speed);
    eventEmitter.emit('setPlaybackSpeed', speed);
  }, []);

  const handleApngError = useCallback(() => {
    createEvent('failover-gif', { apngUrl });
    setUseGif(true);
  }, [apngUrl]);

  const handleSeek = useCallback(() => {
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      if (totalFrames === 0) return;

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
  }, [isPlaying, totalFrames, apngUrl, handlePause, handlePlay, handleNextFrame, handlePreviousFrame]);

  useEffect(() => {
    eventEmitter.on('frameCounterUpdate', setFrameCounter);
    eventEmitter.on('totalFramesUpdate', setTotalFrames);
    eventEmitter.on('seek', handleSeek);

    return () => {
      eventEmitter.off('frameCounterUpdate', setFrameCounter);
      eventEmitter.off('totalFramesUpdate', setTotalFrames);
      eventEmitter.off('seek', handleSeek);
      eventEmitter.emit('pause');
    };
  }, [handleSeek]);

  return (
    <AnimationPlayerContext.Provider
      value={{
        frameCounter,
        isPlaying,
        isLoaded: totalFrames > 0,
        totalFrames,
        playbackSpeed,
        useGif,
        move,
        characterName,
        showAdditionalControls,
        apngUrl,
        onPlay: handlePlay,
        onPause: handlePause,
        onNextFrame: handleNextFrame,
        onPreviousFrame: handlePreviousFrame,
        onGoToFrame: handleGoToFrame,
        onPlaybackSpeedChange: handlePlaybackSpeedChange,
        onApngError: handleApngError,
      }}
    >
      {children}
    </AnimationPlayerContext.Provider>
  );
};
