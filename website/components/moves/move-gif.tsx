import { Move } from "@/models/move";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { Button } from "@nextui-org/button";
import { Image } from "@nextui-org/image";
import { Chip } from "@nextui-org/chip";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FaCircleLeft, FaCirclePause, FaCirclePlay, FaCircleQuestion, FaCircleRight } from "react-icons/fa6";

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

  const initializeGifPlayer = useCallback(async () => {
    if (initialized.current) {
      return;
    }

    initialized.current = true;

    if (imageRef.current?.complete) {
      const SuperGif = (await import("@wizpanda/super-gif")).SuperGif;
      const superGif = new SuperGif(imageRef.current, {});
      superGif.load(() => {
        console.log("Initialized");
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
      gifPlayer.stepFrame(-1);
    }
  };

  return (
    <>
      <div className="gif-wrapper">
        <Image
          ref={imageRef}
          src={params.move.gifUrl}
          onLoad={initializeGifPlayer}
          alt={params.move.name + " - " + params.move.character?.name}
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        {running ? (
          <Button onClick={pause} aria-label="Pause gif" startContent={<FaCirclePause />}>
            Pause
          </Button>
        ) : (
          <Button onClick={play} aria-label="Play gif" startContent={<FaCirclePlay />}>
            Play
          </Button>
        )}
        <Button disableAnimation aria-label="Frame counter" disableRipple>
          Frame: {frameCounter}
        </Button>

        <Button onClick={previousFrame} aria-label="Previous frame" startContent={<FaCircleLeft />}>
          Previous Frame
        </Button>
        <Button onClick={nextFrame} aria-label="Next frame" startContent={<FaCircleRight />}>
          Next Frame
        </Button>
      </div>
      <Accordion>
        <AccordionItem
          startContent={<FaCircleQuestion />}
          key="1"
          aria-label="Hitbox legend"
          title="Hitbox Legend"
          subtitle="Open this to learn more about what the hitbox colors mean"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            <div>
              <h2 className="text-xl">Hitbox IDs</h2>
              <div className="grid grid-cols-1 mt-2">
                <Chip variant="dot" radius="sm" classNames={{ dot: "bg-red-500", base: "w-full" }}>
                  id0
                </Chip>
                <Chip variant="dot" radius="sm" classNames={{ dot: "bg-green-500", base: "w-full" }}>
                  id1
                </Chip>
                <Chip variant="dot" radius="sm" classNames={{ dot: "bg-blue-300", base: "w-full" }}>
                  id2
                </Chip>
                <Chip variant="dot" radius="sm" classNames={{ dot: "bg-purple-500", base: "w-full" }}>
                  id3
                </Chip>
              </div>
            </div>
            <div>
              <h2 className="text-xl">Bone colors</h2>
              <div className="grid grid-cols-1 mt-2">
                <Chip variant="dot" radius="sm" classNames={{ dot: "bg-yellow-500", base: "w-full" }}>
                  Normal
                </Chip>
                <Chip variant="dot" radius="sm" classNames={{ dot: "bg-yellow-600", base: "w-full" }}>
                  Ungrabbable
                </Chip>
                <Chip variant="dot" radius="sm" classNames={{ dot: "bg-blue-700", base: "w-full" }}>
                  Intangible
                </Chip>
                <Chip variant="dot" radius="sm" classNames={{ dot: "bg-green-500", base: "w-full" }}>
                  Invincible
                </Chip>
              </div>
            </div>
            <div>
              <h2 className="text-xl">Character colors</h2>
              <div className="grid grid-cols-1 mt-2">
                <Chip variant="dot" radius="sm" classNames={{ dot: "bg-orange-500", base: "w-full" }}>
                  Auto cancel frame
                </Chip>
                <Chip variant="dot" radius="sm" classNames={{ dot: "bg-pink-500", base: "w-full" }}>
                  IASA
                </Chip>
              </div>
            </div>
          </div>
        </AccordionItem>
      </Accordion>
    </>
  );
};
