import { CharacterBase, Character } from "@/models/character";
import { MoveType } from "@/models/move-type";
import { CrouchCancelMoveOverviewTable } from "./crouch-cancel-move-overview-table";
import { useEffect, useState } from "react";
import { LOCAL_STORAGE_PREFERRED_CC_FLOOR, LOCAL_STORAGE_PREFERRED_CC_SORT } from "@/keys/local-storage-keys";

export interface CrouchCancelMoveListParams {
  target: CharacterBase;
  character: Character;
  floorPercentage: boolean;
  knockbackTarget: number;
}

export function CrouchCancelMoveList(data: Readonly<CrouchCancelMoveListParams>) {
  const moveTypes = [
    {
      type: MoveType.grounded,
      name: "Grounded",
    },
    {
      type: MoveType.tilt,
      name: "Tilt",
    },
    {
      type: MoveType.air,
      name: "Air",
    },
    {
      type: MoveType.special,
      name: "Special",
    },
    {
      type: MoveType.unknown,
      name: "Uncategorised",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
      {moveTypes.map((type) => {
        const moves = data.character.moves.filter(
          (move) => move.type === type.type && move.hitboxes && move.hitboxes.length > 0
        );

        return (
          <div key={type.type}>
            <h2 className="text-xl text-bold">{type.name}</h2>
            {CrouchCancelMoveOverviewTable({
              target: data.target,
              moves: moves,
              floorPercentage: data.floorPercentage,
              knockbackTarget: data.knockbackTarget,
              character: data.character,
            })}
          </div>
        );
      })}
    </div>
  );
}
