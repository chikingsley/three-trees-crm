"use client"

import { ColumnDef } from "@tanstack/react-table"
import { SerializableClient } from "@/types/client" 
import { Checkbox } from "@/components/ui/checkbox"

// Update ColumnDef to use the SerializableClient type
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
    // Use id for the combined name column if accessorKey isn't direct
    id: "name",
    header: "Name",
    // Accessor function now operates on SerializableClient
    accessorFn: (row) => `${row.lastName ?? ''}, ${row.firstName ?? ''}`.trim() || 'N/A',
    // Optional: Add sorting/filtering config later
  },
  {
    accessorKey: "phone",
    header: "Phone",
    // Accessor function remains the same, but operates on SerializableClient
    // Add nullish coalescing for potentially null values
    accessorFn: (row) => row.phone ?? 'N/A',
  },
  {
    accessorKey: "email",
    header: "Email",
    accessorFn: (row) => row.email ?? 'N/A',
  },
  {
    accessorKey: "currentBalance",
    header: "Balance", // Shorten header for space?
    // Format currency
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("currentBalance"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "referralSource",
    header: "Referral Source",
    accessorFn: (row) => row.referralSource ?? 'N/A',
  },
  {
    accessorKey: "referralCounty",
    header: "Referral County",
    accessorFn: (row) => row.referralCounty ?? 'N/A',
  },
  // Notes might be too long for a direct column, consider a details view/modal
  // {
  //   accessorKey: "notes",
  //   header: "Notes",
  //   accessorFn: (row) => row.notes ?? 'N/A',
  // },
  {
    accessorKey: "createdAt",
    header: "Created At",
    // Format the date string
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"))
      const formatted = date.toLocaleDateString() // Adjust format as needed
      return <div className="text-right">{formatted}</div>
    },
    // Optional: Enable sorting
    enableSorting: true,
  },
  // updatedAt might be less relevant for direct view?
  // {
  //   accessorKey: "updatedAt",
  //   header: "Updated At",
  //   accessorFn: (row) => new Date(row.updatedAt).toLocaleDateString(),
  // },
  // TODO: Add actions column later (Edit, View Details, etc.)
]
