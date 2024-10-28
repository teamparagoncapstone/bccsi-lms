import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "../components/data-table-view-options";
import { AiFillFileExcel } from "react-icons/ai";
import { VoiceExercises } from "@/components/forms/voiceExercises";
import ComprehensionTest from "@/components/forms/comprehension-test";
import * as XLSX from "xlsx"; // Import the XLSX library

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

interface DataType {
  id: string;
  voiceId: string;
  image: string;
  userId: string;
  question: string;
}
export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const exportToExcel = () => {
    const rowModel = table.getRowModel();
    const data = rowModel.rows.map((row) => {
      const { id, voiceId, image, userId, ...filteredRow } =
        row.original as DataType;
      return filteredRow;
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const fileName = "comprehension_test.xlsx";

    XLSX.writeFile(workbook, fileName);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <VoiceExercises />
        <ComprehensionTest />
        <Input
          placeholder="Filter modules..."
          value={
            (table.getColumn("question")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("question")?.setFilterValue(event.target.value)
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
