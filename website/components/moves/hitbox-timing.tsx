import { Move } from "@/models/move";
import {
  generateColors,
  getHitboxColor,
  processDuplicateHitboxes,
  processDuplicateHits,
} from "@/utilities/hitbox-utils";
import { flattenData } from "./hitboxes/hitbox-table-columns";

export interface HitboxTimingParams {
  move: Move;
}

export enum HitboxColorConstants {
  IASA = "bg-orange-500",
  AutoCancelBorder = "dark:border-green-500 border-red-500",
}

export function HitboxTiming(params: Readonly<HitboxTimingParams>) {
  const processedHits = processDuplicateHitboxes(params.move.hits!);
  const data = processDuplicateHits(flattenData(processedHits));
  const colors = generateColors(data);

  const getColor = (value: number): string => {
    // Account for counting at 0 instead of 1
    const color = getHitboxColor(colors, value);

    if (color) {
      return color + " text-black";
    }

    if (params.move.iasa == value) {
      return HitboxColorConstants.IASA;
    }

    return "dark:bg-gray-700 bg-gray-200";
  };

  const getBorderColor = (value: number): string => {
    value = value + 1;
    if (
      (params.move.autoCancelBefore && params.move.autoCancelBefore > value) ||
      (params.move.autoCancelAfter && params.move.autoCancelAfter < value)
    ) {
      return HitboxColorConstants.AutoCancelBorder;
    }

    return "";
  };

  // Splits up long moves into multiple chunks of the timeline.
  const chunkLimit = 20;
  const chunks = [];
  let frames = [];

  for (let frame = 1; frame < params.move.totalFrames + 1; frame++) {
    frames.push(frame);
    if (frames.length >= chunkLimit) {
      chunks.push(frames);
      frames = [];
    }
  }

  if (frames.length > 0) {
    chunks.push(frames);
  }

  return (
    <div>
      <h2 className="text-xl font-bold">Hitbox timing</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="w-1/2">
          {chunks.map((chunkedFrames) => (
            <div
              key={chunkedFrames[0]}
              className="grid max-lg:grid-cols-10 max-lg:gap-0 lg:grid-flow-col lg:auto-cols-max"
            >
              {chunkedFrames.map((key) => (
                <div
                  key={key}
                  className={
                    `shrink w-5 h-5 border-black border-1 ${getColor(key)} ${getBorderColor(
                      key
                    )} text-tiny text-center ` + (key % 10 === 0 ? "mr-2" : "")
                  }
                >
                  {key}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="m-2 w-16 grid grid-cols-2">
          <div className={"w-5 h-5 shrink border-black border-1 " + HitboxColorConstants.IASA}></div>
          <div className="ml-1 grow">IASA</div>
          <div className={"w-5 h-5 shrink border-black border-1 " + HitboxColorConstants.AutoCancelBorder}></div>
          <div className="ml-1 grow">Auto Cancelable</div>
        </div>
      </div>
    </div>
  );
}
