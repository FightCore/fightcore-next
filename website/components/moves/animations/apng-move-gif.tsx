import eventEmitter from '@/events/event-emitter';
import parseAPNG from 'apng-js';
import Player from 'apng-js/types/library/player';
import { useCallback, useEffect, useRef, useState } from 'react';
import AnimationLegend from './animation-legend';

export interface ApngMoveParams {
  url: string;
  showAdditionalControls?: boolean;
  onError?: (error: Error) => void;
}

export default function ApngMove(params: Readonly<ApngMoveParams>) {
  const canvasDivRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [player, setPlayer] = useState<Player | null>(null);
  const [url, setUrl] = useState<string>(params.url);
  const [totalFrames, setTotalFrames] = useState(0);

  // Handle URL changes and load APNG
  useEffect(() => {
    const loadAPNG = async () => {
      try {
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
        eventEmitter.emit('totalFramesUpdate', apng.frames.length);
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
          eventEmitter.emit('frameCounterUpdate', frameNumber + 1);
        });
        localPlayer.play();
        setPlayer(localPlayer);
      } catch (error) {
        console.error('Error loading APNG:', error);

        if (player) {
          player.removeAllListeners();
          player.stop();
          setPlayer(null);
          canvasDivRef.current?.remove();
        }

        if (params.onError && error instanceof Error) {
          params.onError(error);
        }
      }
    };

    loadAPNG();
  }, [loaded, url, params.url, player]);

  useEffect(() => {
    return () => {
      if (player && !player.paused) {
        player.pause();
      }
      if (player) {
        player.stop();
      }
    };
  }, [player]);

  // Listen to player control events
  useEffect(() => {
    if (!player) return;

    const handlePlay = () => {
      if (player.paused) {
        player.play();
      }
    };

    const handlePause = () => {
      if (!player.paused) {
        player.pause();
      }
    };

    const handleNextFrame = () => {
      player.pause();
      player.renderNextFrame();
    };

    const handlePreviousFrame = () => {
      player.pause();
      let targetFrame = player.currentFrameNumber;
      if (targetFrame <= 0) {
        targetFrame = totalFrames;
      }
      handleGoToFrame(targetFrame);
    };

    const handleGoToFrame = (frameNumber: number) => {
      if (!player) {
        return;
      }

      const targetFrame = frameNumber;
      if (!player.paused) {
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

    eventEmitter.on('play', handlePlay);
    eventEmitter.on('pause', handlePause);
    eventEmitter.on('nextFrame', handleNextFrame);
    eventEmitter.on('previousFrame', handlePreviousFrame);
    eventEmitter.on('seek', handleGoToFrame);
    eventEmitter.on('setPlaybackSpeed', handlePlaybackSpeedChange);

    return () => {
      eventEmitter.off('play', handlePlay);
      eventEmitter.off('pause', handlePause);
      eventEmitter.off('nextFrame', handleNextFrame);
      eventEmitter.off('previousFrame', handlePreviousFrame);
      eventEmitter.off('seek', handleGoToFrame);
      eventEmitter.off('setPlaybackSpeed', handlePlaybackSpeedChange);
    };
  }, [player, totalFrames]);

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

      <AnimationLegend />
    </>
  );
}
