"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "./data-table-column-header"
import { Row } from "@tanstack/react-table";
import { DataTableRowActions } from "./data-table-row-actions";
import Image from "next/image"
import {Educator} from "@prisma/client"

type RowData = Row<Educator>;


export const columns: ColumnDef<Educator>[] = [
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
    accessorKey: "image",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Image" className="pl-4" />
    ),
    cell: ({ row }) => (
      <Image src={row.original.image || ''} alt="image" className="ml-4"style={{ width: '30px', height: '30px', borderRadius: '50%' }} width={30} height={30} />
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Full Name" />
    ),
  },
  {
    accessorKey: "username",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User Name" />
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: "educatorLevel",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Educator Level" />
    ),
  },
  
  {
    id: "actions",
    cell: ({row}) => (
      <DataTableRowActions row={row} /> 
    ),
  },
]