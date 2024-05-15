import { Move } from '@/models/move';
import {
  Accordion,
  AccordionItem,
  Button,
  Image,
  image,
} from '@nextui-org/react';
import { SuperGif } from '@wizpanda/super-gif';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  FaCircleLeft,
  FaCirclePause,
  FaCirclePlay,
  FaCircleQuestion,
  FaCircleRight,
} from 'react-icons/fa6';

interface MoveGifParams {
  move: Move;
  characterName: string;
}

function getGif(params: MoveGifParams) {
  const beta = true;
  if (beta) {
    return (
      'https://i.fightcore.gg/beta/' +
      params.characterName +
      '/' +
      params.move.normalizedName +
      '.gif'
    );
  } else {
    return (
      'https://i.fightcore.gg/melee/moves/' +
      params.characterName +
      '/' +
      params.move.normalizedName +
      '.gif'
    );
  }
}

export const MoveGif = (params: MoveGifParams) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const [gifPlayer, setGifPlayer] = useState<SuperGif>();
  const initialized = useRef(false);
  const [frameCounter, setFrameCounter] = useState(0);
  const [running, setRunning] = useState(true);

  const initializeGifPlayer = useCallback(() => {
    if (initialized.current) {
      return;
    }

    initialized.current = true;

    if (imageRef.current?.complete) {
      console.log(imageRef.current);
      const superGif = new SuperGif(imageRef.current!, {});
      superGif.load(() => {
        console.log('Initialized');
      });
      setGifPlayer(superGif);
    }
  }, []);

  setInterval(() => {
    setFrameCounter(gifPlayer?.getCurrentFrame() ?? 0);
  }, 100);

  useEffect(() => {
    if (!initialized.current && imageRef.current?.complete && !gifPlayer) {
      initializeGifPlayer();
    }
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
      gifPlayer.stepFrame(-1);
    }
  };

  return (
    <>
      <div className='gif-wrapper'>
        <Image
          ref={imageRef}
          src={getGif(params)}
          onLoad={initializeGifPlayer}
        />
      </div>

      <div className='grid grid-cols-2 gap-2'>
        {running ? (
          <Button onClick={pause} startContent={<FaCirclePause />}>
            Pause
          </Button>
        ) : (
          <Button onClick={play} startContent={<FaCirclePlay />}>
            Play
          </Button>
        )}
        <Button disableAnimation disableRipple>
          Frame: {frameCounter}
        </Button>

        <Button onClick={previousFrame} startContent={<FaCircleLeft />}>
          Previous Frame
        </Button>
        <Button onClick={nextFrame} startContent={<FaCircleRight />}>
          Next Frame
        </Button>
      </div>
      <Accordion>
        <AccordionItem
          startContent={<FaCircleQuestion />}
          key='1'
          aria-label='Accordion 1'
          title='Hitbox Legend'
          subtitle='Open this to learn more about what the colors mean'
        >
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
            <div>
              <h2 className='text-xl'>Hitbox IDs</h2>
              <p>
                <span className='text-red-500'>Red</span>: id0
              </p>
              <p>
                <span className='text-green-500'>Green</span>: id1
              </p>
              <p>
                <span className='text-blue-300'>Light Blue</span>: id2
              </p>
              <p>
                <span className='text-purple-500'>Purple</span>: id3
              </p>
            </div>
            <div>
              <h2 className='text-xl'>Bone colors</h2>
              <p>
                <span className='text-yellow-500'>Yellow</span>: Normal
              </p>
              <p>
                <span className='text-yellow-700'>Pale Yellow</span>:
                Ungrabbable
              </p>
              <p>
                <span className='text-blue-700'>Dark Blue</span>: Intangible
              </p>
              <p>
                <span className='text-green-500'>Green</span>: Invincible
              </p>
            </div>
            <div>
              <h2 className='text-xl'>Character colors</h2>
              <p>
                <span className='text-orange-500'>Orange</span>: Auto cancel
                frame
              </p>
              <p>
                <span className='text-pink-500'>Pink</span>: IASA
              </p>
            </div>
          </div>
        </AccordionItem>
      </Accordion>
    </>
  );
};
