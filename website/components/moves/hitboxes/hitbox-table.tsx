import { Hit } from "@/models/hit";
import { DataType, Table } from "ka-table";
import { flattenData, FlattenedHitbox } from "./hitbox-table-columns";
import {
  generateColors,
  getHitboxColor,
  processDuplicateHitboxes,
  processDuplicateHits,
} from "@/utilities/hitbox-utils";
import MobileHitboxTable from "./mobile-hitbox-table";
import { Hitbox } from "@/models/hitbox";
import { get } from "http";
import { Column } from "ka-table/models";

export interface HitboxTableParams {
  hits: Hit[];
}

function getColorForHitbox(name: string): string | null {
  if (!name) {
    return null;
  }

  if (name.includes("id0")) {
    return "bg-red-500";
  } else if (name.includes("id1")) {
    return "bg-green-500";
  } else if (name.includes("id2")) {
    return "bg-blue-300";
  } else if (name.includes("id3")) {
    return "bg-purple-500";
  }

  return null;
}

function getColumns(hits: FlattenedHitbox[]): Column<FlattenedHitbox>[] {
  const useCrouchedHitlag = hits.some(
    (hit) => hit.hitlagAttacker !== hit.hitlagAttackerCrouched || hit.hitlagDefender !== hit.hitlagDefenderCrouched
  );
  return [
    { key: "hit", title: "Hit", dataType: DataType.String, width: 100 },
    { key: "name", title: "Name", dataType: DataType.String, width: 100 },
    { key: "damage", title: "Damage", dataType: DataType.Number, width: 100 },
    { key: "angle", title: "Angle", dataType: DataType.Number, width: 100 },
    { key: "baseKnockback", title: "Base Knockback", dataType: DataType.Number, width: 100 },
    { key: "knockbackGrowth", title: "Knockback Growth", dataType: DataType.Number, width: 100 },
    { key: "setKnockback", title: "Set Knockback", dataType: DataType.Number, width: 100 },
    { key: "effect", title: "Effect", dataType: DataType.String, width: 100 },
    {
      key: "hitlagAttacker",
      title: "Hitlag Attacker",
      dataType: DataType.Number,
      width: useCrouchedHitlag ? 150 : 100,
    },
    {
      key: "hitlagDefender",
      title: "Hitlag Defender",
      dataType: DataType.Number,
      width: useCrouchedHitlag ? 150 : 100,
    },
    { key: "shieldstun", title: "Shieldstun", dataType: DataType.Number, width: 100 },
  ];
}

export default function HitboxTable(params: Readonly<HitboxTableParams>) {
  const processedHits = processDuplicateHitboxes(params.hits);
  const data = processDuplicateHits(flattenData(processedHits));
  const mobileData = structuredClone(data);
  const colors = generateColors(data);

  const colorCache = new Map<string, string>();

  return (
    <>
      <div className="hidden md:block light:ka-table-light dark:ka-table-dark ka-table overflow-x-auto">
        <Table
          columns={getColumns(data)}
          data={data}
          groups={[{ columnKey: "hit" }]}
          groupPanel={{
            enabled: false,
          }}
          rowKeyField={"id"}
          childComponents={{
            groupCell: {
              content: (props) => {
                switch (props.column.key) {
                  case "hit": {
                    if (props.groupItems && props.groupItems[0] && !colorCache.has(props.groupKey[0])) {
                      const color = getHitboxColor(colors, props.groupItems[0].hitObjects[0].start);
                      colorCache.set(props.groupKey[0], color!);
                    }
                    const color = colorCache.get(props.groupKey[0]);
                    if (color === null) {
                      return props.groupKey;
                    }
                    return (
                      <>
                        <div className={"w-5 h-5 mr-1 border-1 border-black " + color}></div> {props.groupKey}
                      </>
                    );
                  }
                }
              },
            },
            cellText: {
              content: (props) => {
                switch (props.column.key) {
                  case "name": {
                    const color = getColorForHitbox(props.value);
                    if (!color) {
                      return props.value;
                    }
                    return (
                      <>
                        <div className={"w-3 h-3 mr-1 border-1 border-black inline-block " + color}></div> {props.value}
                      </>
                    );
                  }
                  case "hitlagAttacker": {
                    if (props.value !== props.rowData.hitlagAttackerCrouched) {
                      return `${props.value} (${props.rowData.hitlagAttackerCrouched} Crouched)`;
                    }

                    return props.value;
                  }
                  case "hitlagDefender": {
                    if (props.value !== props.rowData.hitlagDefenderCrouched) {
                      return `${props.value} (${props.rowData.hitlagDefenderCrouched} Crouched)`;
                    }

                    return props.value;
                  }
                }
              },
            },
          }}
        />
      </div>
      <div className="block md:hidden">
        <MobileHitboxTable hitboxes={mobileData}></MobileHitboxTable>
      </div>
    </>
  );
}
