import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "../components/data-table-view-options";
import { AiFillFileExcel } from "react-icons/ai";
import { VoiceExercises } from "@/components/forms/voiceExercises";
import ComprehensionTest from "@/components/forms/comprehension-test";
import * as XLSX from "xlsx";

interface DataTableToolbarProps<TData extends Record<string, any>> {
  table: Table<TData>;
}

export function DataTableToolbar<TData extends Record<string, any>>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const exportToExcel = () => {
    // Create an array of the data from the table rows
    const data = table.getRowModel().rows.map((row) => {
      const rowData: Partial<TData> = {};
      Object.keys(row.original).forEach((columnId) => {
        // Exclude specific columns (e.g., "select", "action", etc.)
        if (
          columnId !== "moduleId" &&
          columnId !== "userId" &&
          columnId !== "id" &&
          columnId !== "voiceImage"
        ) {
          rowData[columnId as keyof TData] =
            row.original[columnId as keyof TData];
        }
      });
      return rowData;
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

    // Generate the Excel file and prompt for download
    XLSX.writeFile(workbook, "voice-exercises.xlsx");
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <VoiceExercises />
        <ComprehensionTest />
        <Input
          placeholder="Filter modules..."
          value={(table.getColumn("voice")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("voice")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />

        {isFiltered && (
          <Button
            variant="outline"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
        <Button
          variant="outline"
          onClick={exportToExcel}
          className="h-8 px-2 lg:px-3"
        >
          Export to Excel
          <AiFillFileExcel className="ml-2 h-4 w-4" />
        </Button>
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
