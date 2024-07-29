import { Hit } from "@/models/hit";
import { DataType, Table } from "ka-table";
import { flattenData, FlattenedHitbox } from "./hitbox-table-columns";
import { areAllHitboxesEqual, areHitboxesEqual } from "@/utilities/hitbox-utils";
import { Hitbox } from "@/models/hitbox";

export interface NewHitboxTableParams {
  hits: Hit[];
}

export default function NewHitboxTable2(params: Readonly<NewHitboxTableParams>) {
  const processedHits = processDuplicateHitboxes(params.hits);
  const data = processDuplicateHits(flattenData(processedHits));

  return (
    <div className="custom-theme-demo">
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
      />
    </div>
  );
}

function processDuplicateHitboxes(hits: Hit[]): Hit[] {
  const newData = [];
  for (let hit of hits) {
    if (areAllHitboxesEqual(hit.hitboxes)) {
      const newHitbox = structuredClone(hit.hitboxes[0]);
      newHitbox.name = "All Hitboxes";
      const newHit = structuredClone(hit);
      newHit.hitboxes = [newHitbox];
      newData.push(newHit);
    } else {
      newData.push(hit);
    }
  }
  return newData;
}

function processDuplicateHits(hits: FlattenedHitbox[]): FlattenedHitbox[] {
  let newHits = structuredClone(hits);
  // Javascript moment. Gets the unique items in an array that I can then iterate over.
  let uniqueHitTexts = Array.from(new Set(newHits.map((hit) => hit.hit)));
  for (let i = uniqueHitTexts.length - 1; i > 0; i--) {
    const firstHits = newHits.filter((hit) => hit.hit === uniqueHitTexts[i]);
    const secondHits = newHits.filter((hit) => hit.hit === uniqueHitTexts[i - 1]);
    if (!firstHits || !secondHits) {
      return newHits;
    }

    if (areHitsEqual(firstHits, secondHits)) {
      const newText = secondHits[0].hit + ", " + firstHits[0].hit;
      for (const hit of [...secondHits]) {
        hit.hit = newText;
      }
      const leadingIndex = newHits.indexOf(firstHits[0]);
      newHits.splice(leadingIndex, firstHits.length);
      uniqueHitTexts = Array.from(new Set(newHits.map((hit) => hit.hit)));
    }
  }

  return newHits;
}

function areHitsEqual(hitboxesOne: Hitbox[], hitboxesTwo: Hitbox[]): boolean {
  if (hitboxesOne.length !== hitboxesTwo.length) {
    return false;
  }

  for (const hitboxOne of hitboxesOne) {
    const hitboxTwo = hitboxesTwo.find((hitboxTwo) => hitboxTwo.name === hitboxOne.name);
    if (!hitboxTwo) {
      return false;
    }

    if (!areHitboxesEqual(hitboxOne, hitboxTwo)) {
      return false;
    }
  }

  return true;
}
