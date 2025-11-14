import eventEmitter from '@/events/event-emitter';
import parseAPNG from 'apng-js';
import Player from 'apng-js/types/library/player';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimationControls } from './animation-controls';
import AnimationLegend from './animation-legend';

export interface ApngMoveParams {
  url: string;
  showAdditionalControls?: boolean;
}

export default function ApngMove(params: Readonly<ApngMoveParams>) {
  const canvasDivRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [player, setPlayer] = useState<Player | null>(null);
  const [url, setUrl] = useState<string>(params.url);
  const [frameCounter, setFrameCounter] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [totalFrames, setTotalFrames] = useState(0);

  // Handle URL changes and load APNG
  useEffect(() => {
    const loadAPNG = async () => {
      if (url && url !== params.url) {
        setUrl(params.url);
        player?.removeAllListeners();
        setPlayer(null);
        canvasDivRef.current?.removeChild(canvasDivRef.current.firstChild as Node);
        setLoaded(false);
      } else if (!url) {
        setUrl(params.url);
      }

      if (loaded) {
        return;
      }
      setLoaded(true);
      const response = await fetch(url);
      const buffer = await response.arrayBuffer();
      const apng = parseAPNG(buffer);

      if (apng instanceof Error) {
        console.error('Error parsing APNG:', apng);
        return;
      }

      if (!canvasDivRef || !canvasDivRef.current) {
        console.error('Canvas not found');
        return;
      }
      if (canvasDivRef.current.children.length > 0) {
        return;
      }

      setTotalFrames(apng.frames.length);
      const canvas = document.createElement('canvas');
      canvas.width = apng.width;
      canvas.height = apng.height;
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvasDivRef.current.appendChild(canvas);
      const ctx = canvas.getContext('2d');

      const localPlayer = await apng.getPlayer(ctx!);
      localPlayer.playbackRate = 0.2;
      localPlayer.addListener('frame', (frameNumber: number) => {
        setFrameCounter(frameNumber + 1);
      });
      localPlayer.addListener('play', () => {
        setIsPlaying(true);
      });
      localPlayer.addListener('pause', () => {
        setIsPlaying(false);
      });
      localPlayer.play();
      setPlayer(localPlayer);
    };

    loadAPNG();
  }, [loaded, url, params.url, player]);

  // Handle seek events from event emitter
  useEffect(() => {
    const handleSeek = (frame: number): void => {
      if (!player) {
        return;
      }

      const targetFrame = frame;
      if (isPlaying) {
        player.pause();
      }

      let framesPassed = 0;
      while (targetFrame - 1 !== player.currentFrameNumber) {
        player.renderNextFrame();
        framesPassed++;

        // Safety measure to prevent infinite loops
        if (framesPassed > 200) {
          return;
        }
      }
    };

    eventEmitter.on('seek', handleSeek);

    return () => {
      eventEmitter.off('seek', handleSeek);
    };
  }, [player, isPlaying]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!player) {
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
        handleNextFrame();
      } else if (event.key === 'ArrowLeft') {
        handlePreviousFrame();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [player, isPlaying]);

  const handlePlay = useCallback(() => {
    if (player?.paused) {
      setIsPlaying(true);
      player.play();
    }
  }, [player]);

  const handlePause = useCallback(() => {
    if (player && !player.paused) {
      setIsPlaying(false);
      player.pause();
    }
  }, [player]);

  const handleNextFrame = useCallback(() => {
    if (player) {
      player.pause();
      player.renderNextFrame();
    }
  }, [player]);

  const handlePreviousFrame = useCallback(() => {
    if (player) {
      player.pause();
      let targetFrame = player.currentFrameNumber;
      if (targetFrame <= 0) {
        targetFrame = totalFrames;
      }
      handleGoToFrame(targetFrame);
    }
  }, [player]);

  const handleGoToFrame = useCallback(
    (frameNumber: number) => {
      if (!player) {
        return;
      }

      const targetFrame = frameNumber;
      if (isPlaying) {
        player.pause();
      }

      let framesPassed = 0;
      while (targetFrame - 1 !== player.currentFrameNumber) {
        player.renderNextFrame();
        framesPassed++;

        // Safety measure to prevent infinite loops
        if (framesPassed > 200) {
          return;
        }
      }
    },
    [player, isPlaying],
  );

  const handlePlaybackSpeedChange = useCallback(
    (speed: number) => {
      if (player) {
        player.playbackRate = speed;
      }
    },
    [player],
  );

  return (
    <>
      {!loaded || !player ? (
        <div className="h-96 w-full p-3">
          <div className="skeleton bg-default-300 h-full w-full rounded-lg"></div>
        </div>
      ) : (
        <></>
      )}
      <div ref={canvasDivRef} />

      <AnimationControls
        frameCounter={frameCounter}
        totalFrames={totalFrames}
        isPlaying={isPlaying}
        onPlay={handlePlay}
        onPause={handlePause}
        onNextFrame={handleNextFrame}
        onPreviousFrame={handlePreviousFrame}
        onGoToFrame={handleGoToFrame}
        showPlaybackSpeed={true}
        onPlaybackSpeedChange={handlePlaybackSpeedChange}
        showFirstLastButtons={params.showAdditionalControls}
        onGoToFirstFrame={() => handleGoToFrame(1)}
        onGoToLastFrame={() => {
          if (player) {
            handleGoToFrame(totalFrames);
          }
        }}
      />
      <AnimationLegend />
    </>
  );
}
