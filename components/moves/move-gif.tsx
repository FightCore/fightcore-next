import { Move } from '@/models/move';
import { Button } from '@nextui-org/react';
import { SuperGif } from '@wizpanda/super-gif';
import React, { useRef, useState } from 'react';

interface MoveGifParams {
  move: Move;
  characterName: string;
}

export const MoveGif = (params: MoveGifParams) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const [gifPlayer, setGifPlayer] = useState<SuperGif>();

  const initializeGifPlayer = () => {
    console.log('Initializing player');
    if (imageRef) {
      console.log(imageRef.current);
      const superGif = new SuperGif(imageRef.current!, {});
      superGif.load(() => {
        console.log('Initialized');
      });
      setGifPlayer(superGif);
      return;
    }
    console.log('Missed player hit');
  };
  const pause = () => {
    if (gifPlayer?.isPlaying()) {
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
      <em>This is a temporary GIF player, to be reworked in FCWEB-6</em>
      <img
        ref={imageRef}
        width={500}
        height={300}
        src={
          'https://i.fightcore.gg/melee/moves/' +
          params.characterName +
          '/' +
          params.move.normalizedName +
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
