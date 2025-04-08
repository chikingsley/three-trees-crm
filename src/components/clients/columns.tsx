"use client"

import { ColumnDef } from "@tanstack/react-table"
import { SerializableClient } from "@/types/client" 
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"

export const columns: ColumnDef<SerializableClient>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected()
            ? true
            : table.getIsSomePageRowsSelected()
            ? "indeterminate"
            : false
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    accessorFn: (row) => `${row.lastName ?? ''}, ${row.firstName ?? ''}`.trim() || 'N/A',
    enableSorting: true,
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
    accessorFn: (row) => row.phone ?? 'N/A',
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    accessorFn: (row) => row.email ?? 'N/A',
    enableSorting: true,
  },
  {
    accessorKey: "currentBalance",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Balance" className="justify-end"/>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("currentBalance"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
      return <div className="text-right font-medium">{formatted}</div>
    },
    enableSorting: true,
  },
  {
    accessorKey: "referralSource",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Referral Source" />
    ),
    accessorFn: (row) => row.referralSource ?? 'N/A',
    enableSorting: true,
  },
  {
    accessorKey: "referralCounty",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Referral County" />
    ),
    accessorFn: (row) => row.referralCounty ?? 'N/A',
    enableSorting: true,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" className="justify-end" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"))
      const formatted = date.toLocaleDateString()
      return <div className="text-right">{formatted}</div>
    },
    enableSorting: true,
  },
  // TODO: Add actions column later (Edit, View Details, etc.)
]
