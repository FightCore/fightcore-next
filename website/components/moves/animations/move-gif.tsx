import { Move } from '@/models/move';
import { Button } from "@heroui/button";
import { Image } from "@heroui/image";
import { Kbd } from "@heroui/kbd";
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
          <Button onPress={pause} aria-label="Pause gif" startContent={<Kbd keys={['space']} />}>
            Pause
          </Button>
        ) : (
          <Button onPress={play} aria-label="Play gif" startContent={<Kbd keys={['space']} />}>
            Play
          </Button>
        )}
        <Button disableAnimation aria-label="Frame counter" disableRipple>
          Frame: {frameCounter}
        </Button>

        <Button onPress={previousFrame} aria-label="Previous frame" startContent={<Kbd keys={['left']} />}>
          Previous Frame
        </Button>
        <Button onPress={nextFrame} aria-label="Next frame" startContent={<Kbd keys={['right']} />}>
          Next Frame
        </Button>
      </div>
      <AnimationLegend />
    </>
  );
};
