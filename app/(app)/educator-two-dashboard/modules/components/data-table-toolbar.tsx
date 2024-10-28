import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "../components/data-table-view-options";
import { AiFillFileExcel } from "react-icons/ai";
import { CreateModules } from "@/components/forms/create-modules";
import { AddNewQuestions } from "@/components/forms/questions";
import * as XLSX from "xlsx";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const exportToExcel = () => {
    const data = table.getRowModel().rows.map((row) => {
      const rowData: Record<string, any> = {};
      row.getVisibleCells().forEach((cell) => {
        const columnId = cell.column.id;
        // Exclude video and image module fields
        if (
          columnId !== "videoModule" &&
          columnId !== "imageModule" &&
          columnId !== "select" &&
          columnId !== "actions"
        ) {
          rowData[columnId] = cell.getValue();
        }
      });
      return rowData;
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    XLSX.writeFile(workbook, "module.xlsx");
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <CreateModules />
        <AddNewQuestions />
        <Input
          placeholder="Filter modules..."
          value={
            (table.getColumn("moduleTitle")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("moduleTitle")?.setFilterValue(event.target.value)
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
