import { Move } from '@/models/move';
import { Button } from '@nextui-org/react';
import { SuperGif } from '@wizpanda/super-gif';
import React, { useEffect, useRef, useState } from 'react';

interface MoveGifParams {
  move: Move;
  characterName: string;
}

export const MoveGif = (params: MoveGifParams) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const [gifPlayer, setGifPlayer] = useState<SuperGif>();

  const initializeGifPlayer = () => {
    if (imageRef) {
      console.log(imageRef.current);
      const superGif = new SuperGif(imageRef.current!, {});
      superGif.load(() => {
        console.log('Initialized');
      });
      setGifPlayer(superGif);
    }
  };
  const pause = () => {
    if (gifPlayer && gifPlayer.isPlaying()) {
      gifPlayer.pause();
    }
  };
  const play = () => {
    if (gifPlayer && !gifPlayer.isPlaying()) {
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
      <img
        className='w-full'
        ref={imageRef}
        src={
          'https://i.fightcore.gg/melee/moves/' +
          params.characterName +
          '/' +
          params.move!.normalizedName +
          '.gif'
        }
        onLoad={initializeGifPlayer}
      />
      <Button onClick={pause}>Pause</Button>
      <Button onClick={play}>Play</Button>
      <Button onClick={nextFrame}>Next Frame</Button>
      <Button onClick={previousFrame}>Previous Frame</Button>
    </>
  );
};
