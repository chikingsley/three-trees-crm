"use client";

import { ColumnDef } from "@tanstack/react-table";
import { SerializableFacilitator } from "@/types/facilitator";

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString();
};

export const columns: ColumnDef<SerializableFacilitator>[] = [
  {
    id: "name",
    header: "Name",
    accessorFn: (row) => `${row.lastName ?? ''}, ${row.firstName ?? ''}`.trim() || 'N/A',
  },
  {
    accessorKey: "email",
    header: "Email",
    accessorFn: (row) => row.email ?? 'N/A',
  },
  {
    accessorKey: "phone",
    header: "Phone",
    accessorFn: (row) => row.phone ?? 'N/A',
  },
  {
    accessorKey: "schedule",
    header: "Schedule",
    accessorFn: (row) => row.schedule ?? 'N/A',
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => formatDate(row.getValue("createdAt")),
    enableSorting: true,
  },
  // Add actions column later
]; 