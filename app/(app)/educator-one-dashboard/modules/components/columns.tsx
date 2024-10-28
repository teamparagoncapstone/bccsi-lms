"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "./data-table-column-header"
import { Row } from "@tanstack/react-table";
import { Module } from "@prisma/client"
import { DataTableRowActions } from "./data-table-row-actions";

type RowData = Row<Module>;



export const columns: ColumnDef<Module>[] = [
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
    accessorKey: "moduleTitle",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Module Title" />
    ),
  },
  {
    accessorKey: "moduleDescription",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Module Description" />
    ),
  },
  {
    accessorKey: "learnOutcome1",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Learning Outcome 1" />
    ),
  },
  {
    accessorKey: "videoModule",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Video Module" />
    ),
  },
  {
    accessorKey: "imageModule",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Image Module" />
    ),
  },
  {
    accessorKey: "grade",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Grade" />
    ),
  },
  {
    accessorKey: "subjects",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Subject" />
    ),
  },
  
  {
    id: "actions",
    cell: ({row}) => (
      <DataTableRowActions row={row} /> 
    ),
  },
]
