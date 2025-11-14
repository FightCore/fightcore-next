import eventEmitter from '@/events/event-emitter';
import { Button } from '@heroui/button';
import { Kbd } from '@heroui/kbd';
import { Select, SelectItem } from '@heroui/select';
import parseAPNG from 'apng-js';
import Player from 'apng-js/types/library/player';
import { useCallback, useEffect, useRef, useState } from 'react';
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
  const [playing, setPlaying] = useState(false);
  const [totalFrames, setTotalFrames] = useState(0);

  const escFunction = useCallback(
    (event: KeyboardEvent) => {
      if (!player) {
        return;
      }
      if (event.key === ' ') {
        if (!playing) {
          player.pause();
        } else {
          player.play();
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
    [player],
  );

  useEffect(() => {
    document.addEventListener('keydown', escFunction, false);

    return () => {
      document.removeEventListener('keydown', escFunction, false);
    };
  }, [escFunction]);

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
      const apng = await parseAPNG(buffer);

      if (apng instanceof Error) {
        console.error('Error parsing APNG:', apng);
        return;
      }
      setTotalFrames(apng.frames.length);
      if (!canvasDivRef || !canvasDivRef.current) {
        console.error('Canvas not found');
        return;
      }
      if (canvasDivRef.current.children.length > 0) {
        return;
      }
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
        setPlaying(true);
      });
      localPlayer.addListener('pause', () => {
        setPlaying(false);
      });
      localPlayer.play();
      setPlayer(localPlayer);
    };

    loadAPNG();
  }, [loaded]);

  useEffect(() => {
    const handleSeek = (frame: number): void => {
      if (!player) {
        return;
      }

      const targetFrame = frame;
      if (playing) {
        player.pause();
      }

      let framesPassed = 0;
      while (targetFrame - 1 != player.currentFrameNumber) {
        player.renderNextFrame();
        framesPassed++;

        // Safety measure to make sure we don't loop infinitely
        if (framesPassed > 200) {
          return;
        }
      }
    };

    eventEmitter.on('seek', handleSeek);

    // Clean up the event listener on component unmount
    return () => {
      eventEmitter.off('seek', handleSeek);
    };
  }, [player]);

  const previousFrame = () => {
    if (!player) {
      return;
    }

    if (playing) {
      player.pause();
    }

    const targetFrame = (player.currentFrameNumber + totalFrames - 1) % totalFrames;
    goToFrame(targetFrame + 1);
  };

  const nextFrame = () => {
    if (!player) {
      return;
    }

    if (playing) {
      player.pause();
    }
    player.renderNextFrame();
  };

  const goToFrame = (frame: number) => {
    if (!player) {
      return;
    }

    if (playing) {
      player.pause();
    }

    const targetFrame = frame;
    let framesPassed = 0;
    while (targetFrame - 1 != player.currentFrameNumber) {
      player.renderNextFrame();
      framesPassed++;

      // Safety measure to make sure we don't loop infinitely
      if (framesPassed > 200) {
        return;
      }
    }
  };

  const pause = () => {
    if (!player) {
      return;
    }
    player.pause();
  };

  const play = () => {
    if (!player) {
      return;
    }
    player.play();
  };

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

      <div className="grid grid-cols-2 gap-2">
        {playing ? (
          <Button onPress={pause} aria-label="Pause gif" startContent={<Kbd keys={['space']} />}>
            Pause
          </Button>
        ) : (
          <Button onPress={play} aria-label="Play gif" startContent={<Kbd keys={['space']} />}>
            Play
          </Button>
        )}
        <Button disableAnimation aria-label="Frame counter" disableRipple>
          Frame: {frameCounter} of {totalFrames}
        </Button>
        <Button onPress={previousFrame} aria-label="Previous frame" startContent={<Kbd keys={['left']} />}>
          Previous Frame
        </Button>
        <Button onPress={nextFrame} aria-label="Next frame" startContent={<Kbd keys={['right']} />}>
          Next Frame
        </Button>
        <Select
          // Keys are treated like strings even when inputting numbers.
          // Set the default to a string and then convert it to a number.
          defaultSelectedKeys={['0.2']}
          onSelectionChange={(value) => {
            if (player) {
              player.playbackRate = Number(value.currentKey);
            }
          }}
          aria-label="Playback speed"
        >
          <SelectItem key={'0.2'}>12 FPS (Default)</SelectItem>
          <SelectItem key={'1'}>60 FPS (In-game speed)</SelectItem>
        </Select>
        <Button>Report issue</Button>
        {params.showAdditionalControls ? (
          <Button onPress={() => goToFrame(1)} aria-label="First frame">
            First Frame
          </Button>
        ) : (
          <></>
        )}
        {params.showAdditionalControls ? (
          <Button onPress={() => goToFrame(totalFrames)} aria-label="Last frame">
            Last Frame
          </Button>
        ) : (
          <></>
        )}
      </div>
      <AnimationLegend />
    </>
  );
}
