"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "./data-table-column-header";
import { Row } from "@tanstack/react-table";
import { Questions } from "@prisma/client";
import { DataTableRowActions } from "./data-table-row-actions";

type RowData = Row<Questions>;

export const columns: ColumnDef<Questions>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  // {
  //   accessorKey: "id",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="ID" />
  //   ),
  // },
  {
    accessorKey: "question",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Questions" />
    ),
  },
  {
    accessorKey: "Option1",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Option 1" />
    ),
  },
  {
    accessorKey: "Option2",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Option 2" />
    ),
  },
  {
    accessorKey: "Option3",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Option 3" />
    ),
  },

  {
    accessorKey: "CorrectAnswers",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Correct Answer" />
    ),
  },

  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
