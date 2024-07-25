import { Move } from "@/models/move";

export interface HitboxTimingParams {
  move: Move;
}

export function HitboxTiming(params: Readonly<HitboxTimingParams>) {
  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-black dark:bg-white",
    "bg-pink-500",
    "bg-green-700",
    "bg-blue-300",
    "bg-blue-700",
    "bg-amber-500",
    "bg-lime-500",
  ];
  const getColor = (value: number): string => {
    // Account for counting at 0 instead of 1
    value = value + 1;
    const index = params.move.hits!.findIndex((hit) => value >= hit.start && value <= hit.end);
    if (index > -1) {
      return colors[index];
    }
    if (params.move.iasa == value) {
      return "bg-orange-500";
    }
    return "bg-gray-700";
  };

  const getBorderColor = (value: number): string => {
    value = value + 1;
    if (params.move.autoCancelBefore && params.move.autoCancelBefore > value) {
      return "border-1 border-green-500";
    } else if (params.move.autoCancelAfter && params.move.autoCancelAfter < value) {
      return "border-1 border-green-500";
    }

    return "";
  };

  const frames = [];
  for (let frame = 0; frame < params.move.totalFrames; frame++) {
    frames.push(frame);
  }

  return (
    <div>
      <h2 className="text-xl font-bold">Hitbox timing</h2>
      <div className="grid grid-flow-col auto-cols-max">
        {frames.map((key) => (
          <div key={key} className={`w-4 h-4 border-black border-1 ${getColor(key)} ${getBorderColor(key)}`} />
        ))}
      </div>
    </div>
  );
}
