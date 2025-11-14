import eventEmitter from '@/events/event-emitter';
import { Move } from '@/models/move';
import { Image } from '@heroui/image';
import { useCallback, useEffect, useRef, useState } from 'react';
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

  const initializeGifPlayer = useCallback(async () => {
    if (initialized.current) {
      return;
    }

    initialized.current = true;

    if (imageRef.current?.complete) {
      const SuperGif = (await import('@wizpanda/super-gif')).SuperGif;
      const superGif = new SuperGif(imageRef.current, {});
      superGif.load(() => {
        eventEmitter.emit('totalFramesUpdate', superGif.getLength());
        console.log('Initialized');
      });

      setGifPlayer(superGif);
    }
  }, []);

  // Update frame counter periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (gifPlayer) {
        eventEmitter.emit('frameCounterUpdate', gifPlayer.getCurrentFrame() + 1);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [gifPlayer]);

  // Initialize player when image loads
  useEffect(() => {
    if (!initialized.current && imageRef.current?.complete && !gifPlayer) {
      initializeGifPlayer();
    }
  }, []);

  useEffect(() => {
    return () => {
      if (gifPlayer && gifPlayer.isPlaying()) {
        gifPlayer.pause();
      }
    };
  }, [gifPlayer]);

  // Listen to player control events
  useEffect(() => {
    if (!gifPlayer) return;

    const handlePlay = () => {
      if (!gifPlayer.isPlaying()) {
        gifPlayer.play();
      }
    };

    const handlePause = () => {
      if (gifPlayer.isPlaying()) {
        gifPlayer.pause();
      }
    };

    const handleNextFrame = () => {
      if (gifPlayer.isPlaying()) {
        gifPlayer.pause();
      }
      gifPlayer.stepFrame(1);
    };

    const handlePreviousFrame = () => {
      if (gifPlayer.isPlaying()) {
        gifPlayer.pause();
      }

      if (gifPlayer.getCurrentFrame() === 0) {
        gifPlayer.moveTo(gifPlayer.getLength() - 1);
      } else {
        gifPlayer.stepFrame(-1);
      }
    };

    const handleGoToFrame = (frameNumber: number) => {
      if (!gifPlayer) {
        return;
      }

      if (gifPlayer.isPlaying()) {
        gifPlayer.pause();
      }

      const zeroIndexed = frameNumber - 1;
      if (zeroIndexed >= 0 && zeroIndexed < gifPlayer.getLength()) {
        gifPlayer.moveTo(zeroIndexed);
      }
    };

    eventEmitter.on('play', handlePlay);
    eventEmitter.on('pause', handlePause);
    eventEmitter.on('nextFrame', handleNextFrame);
    eventEmitter.on('previousFrame', handlePreviousFrame);
    eventEmitter.on('seek', handleGoToFrame);

    return () => {
      eventEmitter.off('play', handlePlay);
      eventEmitter.off('pause', handlePause);
      eventEmitter.off('nextFrame', handleNextFrame);
      eventEmitter.off('previousFrame', handlePreviousFrame);
      eventEmitter.off('seek', handleGoToFrame);
    };
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
      <AnimationLegend />
    </>
  );
};
