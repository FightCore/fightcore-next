import { Move } from '@/models/move';
import { Button } from '@nextui-org/button';
import { Image } from '@nextui-org/image';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Kbd } from '@nextui-org/kbd';
import AnimationLegend from './animation-legend';

interface MoveGifParams {
  move: Move;
  characterName: string;
}

export const MoveGif = (params: MoveGifParams) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const [gifPlayer, setGifPlayer] = useState<any>();
  const initialized = useRef(false);
  const [frameCounter, setFrameCounter] = useState(1);
  const [running, setRunning] = useState(true);

  const escFunction = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === ' ') {
        if (gifPlayer.isPlaying()) {
          pause();
        } else {
          play();
        }
        event.preventDefault();
      }
      if (event.key === 'ArrowRight') {
        nextFrame();
      }
      if (event.key === 'ArrowLeft') {
        previousFrame();
      }
    },
    [gifPlayer],
  );

  useEffect(() => {
    document.addEventListener('keydown', escFunction, false);

    return () => {
      document.removeEventListener('keydown', escFunction, false);
    };
  }, [escFunction]);

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

  setInterval(() => {
    setFrameCounter((gifPlayer?.getCurrentFrame() ?? 0) + 1);
  }, 100);

  useEffect(() => {
    if (!initialized.current && imageRef.current?.complete && !gifPlayer) {
      initializeGifPlayer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pause = () => {
    if (gifPlayer?.isPlaying()) {
      setRunning(false);
      gifPlayer.pause();
    }
  };
  const play = () => {
    if (gifPlayer && !gifPlayer.isPlaying()) {
      setRunning(true);
      gifPlayer.play();
    }
  };
  const nextFrame = () => {
    if (gifPlayer) {
      if (gifPlayer.isPlaying()) {
        gifPlayer.pause();
      }
      gifPlayer.stepFrame(1);
    }
  };

  const previousFrame = () => {
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
  };

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

      <div className="grid grid-cols-2 gap-2">
        {running ? (
          <Button onClick={pause} aria-label="Pause gif" startContent={<Kbd keys={['space']} />}>
            Pause
          </Button>
        ) : (
          <Button onClick={play} aria-label="Play gif" startContent={<Kbd keys={['space']} />}>
            Play
          </Button>
        )}
        <Button disableAnimation aria-label="Frame counter" disableRipple>
          Frame: {frameCounter}
        </Button>

        <Button onClick={previousFrame} aria-label="Previous frame" startContent={<Kbd keys={['left']} />}>
          Previous Frame
        </Button>
        <Button onClick={nextFrame} aria-label="Next frame" startContent={<Kbd keys={['right']} />}>
          Next Frame
        </Button>
      </div>
      <AnimationLegend />
    </>
  );
};
