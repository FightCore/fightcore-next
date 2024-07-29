import { Hit } from "@/models/hit";
import { Hitbox } from "@/models/hitbox";
//import { createColumnHelper } from "@tanstack/react-table";

export interface FlattenedHitbox extends Hitbox {
  hit: string;
}

export function flattenData(hits: Hit[]): FlattenedHitbox[] {
  return hits.flatMap((hit) =>
    hit.hitboxes.flatMap((hitbox) => ({
      hit: hit.start + " - " + hit.end,
      ...hitbox,
    }))
  );
}

// export function getColumns(hits: Hit[]) {
//   const flattenedHits = flattenData(hits);
//   const columnHelper = createColumnHelper<FlattenedHitbox>();
//   const columns = [
//     columnHelper.accessor("hit", {
//       cell: (info) => info.getValue(),
//       enableGrouping: true,
//     }),
//     columnHelper.accessor((row) => row.name, {
//       id: "name",
//       header: () => <span>Name</span>,
//       enableGrouping: false,
//       aggregationFn: "unique",
//     }),
//     columnHelper.accessor((row) => row.damage, {
//       id: "damage",
//       header: () => <span>Damage</span>,
//       enableGrouping: false,
//       aggregationFn: "unique",
//     }),
//     columnHelper.accessor((row) => row.baseKnockback, {
//       id: "baseKnockback",
//       header: () => <span>Base Knockback</span>,
//       enableGrouping: false,
//       aggregationFn: "unique",
//     }),
//     columnHelper.accessor((row) => row.knockbackGrowth, {
//       id: "knockbackGrowth",
//       header: () => <span>Knockback Growth</span>,
//       enableGrouping: false,
//       aggregationFn: "unique",
//     }),
//     columnHelper.accessor((row) => row.setKnockback, {
//       id: "setKnockback",
//       header: () => <span>Set Knockback</span>,
//       enableGrouping: false,
//       aggregationFn: "unique",
//     }),

//     columnHelper.accessor((row) => row.effect, {
//       id: "effect",
//       header: () => <span>Effect</span>,
//       enableGrouping: false,
//       aggregationFn: "unique",
//     }),
//   ];

//   return { columns, data: flattenedHits };
// }
