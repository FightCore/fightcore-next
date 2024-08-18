import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { Button } from "@nextui-org/button";
import { Chip } from "@nextui-org/chip";
import { Kbd } from "@nextui-org/kbd";
import { Skeleton } from "@nextui-org/skeleton";
import parseAPNG, { APNG } from "apng-js";
import Player from "apng-js/types/library/player";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaCircleQuestion } from "react-icons/fa6";

export interface ApngMoveParams {
  url: string;
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
      if (event.key === " ") {
        if (!playing) {
          player.pause();
        } else {
          player.play();
        }
        event.preventDefault();
      }
      if (event.key === "ArrowRight") {
        nextFrame();
      }
      if (event.key === "ArrowLeft") {
        previousFrame();
      }
    },
    [player]
  );

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);

    return () => {
      document.removeEventListener("keydown", escFunction, false);
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
        console.error("Error parsing APNG:", apng);
        return;
      }
      setTotalFrames(apng.frames.length);
      if (!canvasDivRef || !canvasDivRef.current) {
        console.error("Canvas not found");
        return;
      }
      if (canvasDivRef.current.children.length > 0) {
        return;
      }
      const canvas = document.createElement("canvas");
      canvas.width = apng.width;
      canvas.height = apng.height;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvasDivRef.current.appendChild(canvas);
      const ctx = canvas.getContext("2d");

      const localPlayer = await apng.getPlayer(ctx!);
      localPlayer.playbackRate = 0.2;
      localPlayer.addListener("frame", (frameNumber: number) => {
        setFrameCounter(frameNumber + 1);
      });
      localPlayer.addListener("play", () => {
        setPlaying(true);
      });
      localPlayer.addListener("pause", () => {
        setPlaying(false);
      });
      localPlayer.play();
      setPlayer(localPlayer);
    };

    loadAPNG();
  }, [loaded]);

  const previousFrame = () => {
    if (!player) {
      return;
    }

    if (playing) {
      player.pause();
    }

    const targetFrame = (player.currentFrameNumber + totalFrames - 1) % totalFrames;
    while (targetFrame != player.currentFrameNumber) {
      player.renderNextFrame();
    }
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
        <div className="p-3 h-96 w-full">
          <div className="h-full w-full rounded-lg bg-default-300 skeleton"></div>
        </div>
      ) : (
        <></>
      )}
      <div ref={canvasDivRef} />

      <div className="grid grid-cols-2 gap-2">
        {playing ? (
          <Button onClick={pause} aria-label="Pause gif" startContent={<Kbd keys={["space"]} />}>
            Pause
          </Button>
        ) : (
          <Button onClick={play} aria-label="Play gif" startContent={<Kbd keys={["space"]} />}>
            Play
          </Button>
        )}
        <Button disableAnimation aria-label="Frame counter" disableRipple>
          Frame: {frameCounter}
        </Button>

        <Button onClick={previousFrame} aria-label="Previous frame" startContent={<Kbd keys={["left"]} />}>
          Previous Frame
        </Button>
        <Button onClick={nextFrame} aria-label="Next frame" startContent={<Kbd keys={["right"]} />}>
          Next Frame
        </Button>
      </div>
      <Accordion>
        <AccordionItem
          startContent={<FaCircleQuestion />}
          key="1"
          aria-label="Hitbox GIF legend"
          title="Hitbox GIF Legend"
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
                  Auto Cancel Frame
                </Chip>
                <Chip variant="dot" radius="sm" classNames={{ dot: "bg-pink-500", base: "w-full" }}>
                  IASA
                </Chip>
              </div>
            </div>
          </div>
          <div className="mt-1">
            <div className="text-xl text-bold">Missing hitbox ids</div>
            <div>
              Sometimes it can appear that the move has multiple coloured hitboxes but is missing them in the table. The
              code for the colouring and the data itself missmatch sometimes. When this is the case,{" "}
              <strong>all hitboxes can be considered to have that data.</strong>
            </div>
          </div>
        </AccordionItem>
      </Accordion>
    </>
  );
}
