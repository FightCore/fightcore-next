import eventEmitter from '@/events/event-emitter';
import parseAPNG from 'apng-js';
import Player from 'apng-js/types/library/player';
import { useEffect, useRef, useState } from 'react';

type ParsedAPNG = Exclude<ReturnType<typeof parseAPNG>, Error>;

// Caches in-flight Promises, not resolved values. Every concurrent caller for the
// same URL awaits the same single fetch rather than starting a new one.
const apngFetchCache = new Map<string, Promise<ParsedAPNG | null>>();

function fetchAndParseApng(url: string): Promise<ParsedAPNG | null> {
  const cached = apngFetchCache.get(url);
  if (cached) return cached;
  const promise = fetch(url)
    .then((r) => r.arrayBuffer())
    .then((buffer) => {
      const apng = parseAPNG(buffer);
      return apng instanceof Error ? null : apng;
    })
    .catch(() => {
      apngFetchCache.delete(url); // Allow retry on network error
      return null;
    });
  apngFetchCache.set(url, promise);
  return promise;
}

export function prefetchApng(url: string): void {
  if (url) fetchAndParseApng(url);
}

export interface ApngMoveParams {
  url: string;
  showAdditionalControls?: boolean;
  onError?: (error: Error) => void;
  contain?: boolean;
}

export default function ApngMove(params: Readonly<ApngMoveParams>) {
  const canvasDivRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Player | null>(null);
  const totalFramesRef = useRef(0);
  const [playerReady, setPlayerReady] = useState(false);

  // Load (or reload) whenever the URL changes
  useEffect(() => {
    let cancelled = false;

    const cleanup = () => {
      if (playerRef.current) {
        playerRef.current.removeAllListeners();
        playerRef.current.stop();
        playerRef.current = null;
      }
      if (canvasDivRef.current) {
        canvasDivRef.current.innerHTML = '';
      }
    };

    const loadAPNG = async () => {
      cleanup();
      setPlayerReady(false);

      try {
        const apng = await fetchAndParseApng(params.url);
        if (cancelled) return;
        if (!apng) {
          params.onError?.(new Error(`Failed to load APNG: ${params.url}`));
          return;
        }
        if (!canvasDivRef.current) return;

        totalFramesRef.current = apng.frames.length;
        eventEmitter.emit('totalFramesUpdate', apng.frames.length);

        const canvas = document.createElement('canvas');
        canvas.width = apng.width;
        canvas.height = apng.height;
        canvas.style.display = 'block';
        if (params.contain) {
          canvas.style.width = 'auto';
          canvas.style.height = 'auto';
          canvas.style.maxWidth = '100%';
          canvas.style.maxHeight = '100%';
        } else {
          canvas.style.width = '100%';
          canvas.style.height = 'auto';
        }
        canvasDivRef.current.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        const localPlayer = await apng.getPlayer(ctx!);
        if (cancelled) {
          localPlayer.stop();
          return;
        }

        localPlayer.playbackRate = 0.2;
        localPlayer.addListener('frame', (frameNumber: number) => {
          eventEmitter.emit('frameCounterUpdate', frameNumber + 1);
        });
        localPlayer.play();
        playerRef.current = localPlayer;
        setPlayerReady(true);
      } catch (error) {
        console.error('Error loading APNG:', error);
        if (!cancelled && params.onError && error instanceof Error) {
          params.onError(error);
        }
      }
    };

    loadAPNG();
    return () => {
      cancelled = true;
      cleanup();
    };
  }, [params.url]);

  // Register event listeners once the player is ready
  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    const handlePlay = () => {
      if (player.paused) player.play();
    };

    const handlePause = () => {
      if (!player.paused) player.pause();
    };

    const handlePlaybackSpeedChange = (speed: number) => {
      player.playbackRate = speed;
    };

    // frameNumber is 1-indexed; player.currentFrameNumber is 0-indexed
    const handleGoToFrame = (frameNumber: number) => {
      if (!player.paused) player.pause();

      const targetIndex = frameNumber - 1;

      // For backward seeks, stop() resets currentFrameNumber to -1 so we
      // can render forward from frame 0 instead of wrapping around the end.
      if (targetIndex <= player.currentFrameNumber) {
        player.stop();
      }

      let safety = 0;
      const limit = totalFramesRef.current + 5;
      while (player.currentFrameNumber !== targetIndex && safety < limit) {
        player.renderNextFrame();
        safety++;
      }
    };

    const handleNextFrame = () => {
      player.pause();
      player.renderNextFrame();
    };

    const handlePreviousFrame = () => {
      player.pause();
      // currentFrameNumber is 0-indexed; passing it as 1-indexed target moves back one frame
      const targetFrame = player.currentFrameNumber <= 0 ? totalFramesRef.current : player.currentFrameNumber;
      handleGoToFrame(targetFrame);
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
  }, [playerReady]);

  return (
    <>
      {!playerReady ? (
        <div className="h-64 w-full p-3">
          <div className="skeleton h-full w-full rounded-lg opacity-20" style={{ background: '#26263a' }} />
        </div>
      ) : null}
      <div
        className={params.contain ? 'flex h-full w-full items-center justify-center' : 'w-full'}
        ref={canvasDivRef}
      />
    </>
  );
}
