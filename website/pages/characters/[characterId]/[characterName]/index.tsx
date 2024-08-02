import { MoveCard } from "@/components/moves/move-card";
import { characters } from "@/config/framedata/framedata";
import { Character } from "@/models/character";
import { Move } from "@/models/move";
import { MoveType } from "@/models/move-type";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { promises as fs } from "fs";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/breadcrumbs";
import { characterRoute } from "@/utilities/routes";
import { CharacterHead } from "@/components/characters/character-head";
import slugify from "slugify";

export type CharacterPage = {
  character: Character | null;
};

export async function getStaticPaths() {
  const normalizedPaths = characters.map((character) => {
    return { params: { characterName: character.normalizedName, characterId: character.fightCoreId.toString() } };
  });
  const nonNormalizedPaths = characters.map((character) => {
    return { params: { characterName: slugify(character.name), characterId: character.fightCoreId.toString() } };
  });
  return {
    paths: [...normalizedPaths, ...nonNormalizedPaths],
    fallback: false,
  };
}

export const getStaticProps = (async (context) => {
  const characterBase = characters.find(
    (baseCharacter) => baseCharacter.fightCoreId.toString() === context?.params?.characterId
  );

  if (!characterBase) {
    return { notFound: true };
  }

  const fileName = process.cwd() + `/config/framedata/${characterBase.normalizedName.replace("%26", "&")}.json`;
  const file = await fs.readFile(fileName, "utf8");
  const character = JSON.parse(file) as Character;
  return {
    props: {
      data: {
        character,
      },
    },
    revalidate: false,
  };
}) satisfies GetStaticProps<{
  data: CharacterPage;
}>;

export default function CharacterPage({ data }: InferGetStaticPropsType<typeof getStaticProps>) {
  const moveTypes = [
    {
      type: MoveType.grounded,
      name: "Grounded",
      sorting: ["jab1", "jab2", "jab3", "rjab", "dattack", "usmash", "fsmash", "fsmash2", "dsmash"],
    },
    {
      type: MoveType.tilt,
      name: "Tilt",
      sorting: ["ftilt", "uaft", "daft", "utilt", "dtilt"],
    },
    {
      type: MoveType.air,
      name: "Air",
      sorting: ["nair", "uair", "bair", "fair", "dair"],
    },
    {
      type: MoveType.special,
      name: "Special",
      sorting: ["neutralb", "aneutralb", "sideb", "asideb", "downb", "adownb", "upb", "aupb"],
    },
    {
      type: MoveType.throw,
      name: "Grab/Throw",
      sorting: [
        "grab",
        "dashgrab",
        "pummel",
        "fthrow",
        "bthrow",
        "uthrow",
        "dthrow",
        "cargo_fthrow",
        "cargo_bthrow",
        "cargo_uthrow",
        "cargo_dthrow",
      ],
    },
    { type: MoveType.dodge, name: "Dodge", sorting: ["spotdodge", "airdodge", "rollbackwards", "rollforward"] },
    { type: MoveType.tech, name: "Getups/Techs" },
    { type: MoveType.item, name: "Item" },
    {
      type: MoveType.kirbySpecial,
      name: "Copy Abilities",
      sorting: [
        "bowserspecial",
        "captainfalconspecial",
        "donkeykongspecial",
        "drmariospecial",
        "falcospecial",
        "foxspecial",
        "ganondorfspecial",
        "iceclimbersspecial",
        "jigglypuffspecial",
        "linkspecial",
        "luigispecial",
        "mariospecial",
        "marthspecial",
        "mewtwospecial",
        "mrgameandwatchspecial",
        "nessspecial",
        "peachspecial",
        "pichuspecial",
        "pikachuspecial",
        "royspecial",
        "samusspecial",
        "sheikspecial",
        "yoshispecial",
        "younglinkspecial",
        "zeldaspecial",
      ],
    },
    {
      type: MoveType.unknown,
      name: "Uncategorised",
    },
  ];

  const movesByCategory = new Map<MoveType, Move[]>();
  const filteredCategories = [];
  for (const moveType of moveTypes) {
    const moves = data.character.moves.filter((move) => move.type === moveType.type);
    if (moves.length > 0) {
      if (moveType.sorting) {
        moves.sort((a, b) => moveType.sorting.indexOf(a.normalizedName) - moveType.sorting.indexOf(b.normalizedName));
      }
      movesByCategory.set(moveType.type, moves);
      filteredCategories.push(moveType);
    }
  }
  return (
    <>
      <CharacterHead character={data.character} />
      <div
        className="min-h-16 w-full text-white bg-red-700 rounded-b-md border-b border-l border-r
            border-gray-700 flex justify-center items-center mb-2 p-1"
      >
        <p className="text-4xl font-extrabold text-center">{data.character.name}</p>
      </div>
      <Breadcrumbs>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href={characterRoute(data.character)}>{data.character.name}</BreadcrumbItem>
      </Breadcrumbs>
      {filteredCategories.map((moveType) => (
        <div key={moveType.type}>
          <div
            className="h-16 w-full bg-gray-200 dark:bg-gray-800 rounded border
              border-gray-300 dark:border-gray-800 flex justify-center items-center my-4"
          >
            <p className="text-2xl font-bold text-center">{moveType.name}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {movesByCategory.get(moveType.type)!.map((move: any, index: number) => (
              <div className="flex flex-grow" key={move.normalizedName}>
                <MoveCard character={data.character} move={move} lazy={index > 5} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
