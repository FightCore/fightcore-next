import { Move } from '@/models/move';
import { Image } from '@heroui/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimationControls } from './animation-controls';
import AnimationLegend from './animation-legend';

interface MoveGifParams {
  move: Move;
  characterName: string;
}

export const MoveGif = (params: MoveGifParams) => {
  const imageRef = useRef<HTMLImageElement>(null);

  // Using any here due to the dynamic import.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [gifPlayer, setGifPlayer] = useState<any>();
  const initialized = useRef(false);
  const [frameCounter, setFrameCounter] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);

  const initializeGifPlayer = useCallback(async () => {
    if (initialized.current) {
      return;
    }

    initialized.current = true;

    if (imageRef.current?.complete) {
      const SuperGif = (await import('@wizpanda/super-gif')).SuperGif;
      const superGif = new SuperGif(imageRef.current, {});
      superGif.load(() => {
        console.log('Initialized');
      });
      setGifPlayer(superGif);
    }
  }, []);

  // Update frame counter periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (gifPlayer) {
        setFrameCounter(gifPlayer.getCurrentFrame() + 1);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [gifPlayer]);

  // Initialize player when image loads
  useEffect(() => {
    if (!initialized.current && imageRef.current?.complete && !gifPlayer) {
      initializeGifPlayer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!gifPlayer) {
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
  }, [gifPlayer, isPlaying, handlePlay, handlePause, handleNextFrame, handlePreviousFrame]);

  const handlePlay = useCallback(() => {
    if (gifPlayer && !gifPlayer.isPlaying()) {
      setIsPlaying(true);
      gifPlayer.play();
    }
  }, [gifPlayer]);

  const handlePause = useCallback(() => {
    if (gifPlayer && gifPlayer.isPlaying()) {
      setIsPlaying(false);
      gifPlayer.pause();
    }
  }, [gifPlayer]);

  const handleNextFrame = useCallback(() => {
    if (gifPlayer) {
      if (gifPlayer.isPlaying()) {
        gifPlayer.pause();
      }
      gifPlayer.stepFrame(1);
    }
  }, [gifPlayer]);

  const handlePreviousFrame = useCallback(() => {
    if (gifPlayer) {
      if (gifPlayer.isPlaying()) {
        gifPlayer.pause();
      }

      if (gifPlayer.getCurrentFrame() === 0) {
        gifPlayer.moveTo(gifPlayer.getLength() - 1);
      } else {
        gifPlayer.stepFrame(-1);
      }
    }
  }, [gifPlayer]);

  return (
    <>
      <div className="gif-wrapper">
        <Image
          height={400}
          width={500}
          ref={imageRef}
          src={params.move.gifUrl}
          onLoad={initializeGifPlayer}
          alt={params.move.name + ' - ' + params.move.character?.name}
        />
      </div>

      <AnimationControls
        frameCounter={frameCounter}
        totalFrames={gifPlayer?.getLength() ?? 0}
        isPlaying={isPlaying}
        onPlay={handlePlay}
        onPause={handlePause}
        onNextFrame={handleNextFrame}
        onPreviousFrame={handlePreviousFrame}
      />
      <AnimationLegend />
    </>
  );
};
