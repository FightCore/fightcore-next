import { Card, CardBody, CardHeader } from "@nextui-org/react";

const patchNotes = [
  {
    version: 0.2,
    changes: [
      "A Move GIF's frame counter now starts from 1 instead of 0",
      "Hid the Hitboxes and Crouch cancel table for moves without a hitbox",
      "Fixed the routes within the breadcrumbs to be correct",
      "Added True or False behind the Can wall jump",
      "Added a characters banner above the characters",
    ],
  },
  { version: 0.1, changes: ["Initial beta release"] },
];

export default function PatchNotesPage() {
  return (
    <>
      <div
        className="h-16 w-full bg-red-400 dark:bg-red-700 rounded-b-md border-b border-l border-r border-gray-700
          flex justify-center items-center mb-2"
      >
        <p className="text-4xl font-extrabold text-center">Patch notes</p>
      </div>
      {patchNotes.map((patchNote) => (
        <Card key={patchNote.version} className="my-2 dark:bg-gray-800">
          <CardHeader>
            <p className="text-md">{patchNote.version}</p>
          </CardHeader>
          <CardBody>
            <div className="px-4">
              <ul className="list-disc">
                {patchNote.changes.map((change) => (
                  <li key={change}>{change}</li>
                ))}
              </ul>
            </div>
          </CardBody>
        </Card>
      ))}
    </>
  );
}
