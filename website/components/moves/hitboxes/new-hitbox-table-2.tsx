import { Hit } from "@/models/hit";
import { DataType, Table } from "ka-table";
import { flattenData } from "./hitbox-table-columns";
import {
  generateColors,
  getHitboxColor,
  processDuplicateHitboxes,
  processDuplicateHits,
} from "@/utilities/hitbox-utils";

export interface NewHitboxTableParams {
  hits: Hit[];
}

export default function NewHitboxTable2(params: Readonly<NewHitboxTableParams>) {
  const processedHits = processDuplicateHitboxes(params.hits);
  const data = processDuplicateHits(flattenData(processedHits));
  const colors = generateColors(data);

  const colorCache = new Map<string, string>();

  return (
    <div className="light:ka-table-light dark:ka-table-dark ka-table">
      <Table
        columns={[
          { key: "hit", title: "Hit", dataType: DataType.String },
          { key: "name", title: "Name", dataType: DataType.String },
          { key: "damage", title: "Damage", dataType: DataType.Number },
          { key: "angle", title: "Angle", dataType: DataType.Number },
          { key: "baseKnockback", title: "Base Knockback", dataType: DataType.Number },
          { key: "knockbackGrowth", title: "Knockback Growth", dataType: DataType.Number },
          { key: "setKnockback", title: "Set Knockback", dataType: DataType.Number },
          { key: "effect", title: "Effect", dataType: DataType.String },
          { key: "shieldstun", title: "Shieldstun", dataType: DataType.Number },
        ]}
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
                  return (
                    <>
                      <div className={"w-5 h-5 mr-1 border-1 border-black " + color}></div> Hits {props.groupKey}
                    </>
                  );
                }
              }
            },
          },
        }}
      />
    </div>
  );
}
