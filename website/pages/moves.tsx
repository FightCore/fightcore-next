import { moves } from "@/config/framedata/moves";
import { ExportedMove } from "@/models/exported-moves";
import { AgGridReact } from "ag-grid-react";
import { useState } from "react";

export default function Moves() {
  const [colDefs, setColDefs] = useState([
    { field: "name" },
    { field: "characterName" },
    { field: "totalFrames" },
    { field: "start" },
    { field: "end" },
    { field: "iasa" },
  ]);
  return (
    <>
      <div
        className="h-16 w-full bg-gray-200 dark:bg-gray-800 rounded border
          border-gray-300 dark:border-gray-800 flex justify-center items-center mb-4"
      >
        <p className="text-2xl font-bold text-center">Moves</p>
      </div>
      <div
        className="ag-theme-quartz" // applying the Data Grid theme
        style={{ height: 500 }} // the Data Grid will fill the size of the parent container
      >
        <AgGridReact rowData={moves} columnDefs={colDefs} />
      </div>
    </>
  );
}
