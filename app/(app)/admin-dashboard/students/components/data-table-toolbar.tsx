import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "../components/data-table-view-options";
import { AddNewStudent } from "../../../../../components/forms/add-new-student";
import { AiFillFileExcel } from "react-icons/ai";
import * as XLSX from "xlsx";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}
interface StudentData {
  id: string;
  studentPassword: string;
  studentUsername: string;
  image: string;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      table.getRowModel().rows.map((row) => {
        const { studentPassword, studentUsername, id, image, ...rest } =
          row.original as StudentData;
        return rest;
      })
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, "students.xlsx");
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <AddNewStudent />
        <Input
          onChange={(event) => {
            const value = event.target.value;
            table.setGlobalFilter(value);
          }}
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
          onClick={handleExportToExcel}
          className="h-8 px-2 lg:px-3"
        >
          Export to Excel <AiFillFileExcel className="ml-2 h-4 w-4" />
        </Button>
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
