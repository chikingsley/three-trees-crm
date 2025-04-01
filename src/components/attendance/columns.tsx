"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { ApiAttendanceRecord } from "@/types/attendance";

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return 'N/A';
  // Date string from API is already YYYY-MM-DD
  // return new Date(dateString).toLocaleDateString(); // No need to parse if format is known
  return dateString;
};

// Update ColumnDef to use the imported ApiAttendanceRecord type
export const columns: ColumnDef<ApiAttendanceRecord>[] = [
  {
    accessorKey: "attendanceActualDate",
    header: "Date",
    cell: ({ row }) => formatDate(row.getValue("attendanceActualDate")),
    enableSorting: true,
  },
  {
    accessorKey: "clientName",
    header: "Client",
    cell: ({ row }) => row.getValue("clientName") ?? 'N/A',
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      let variant: "outline" | "secondary" | "destructive" = "outline";
      if (status === 'PRESENT') variant = "secondary";
      if (status === 'ABSENT') variant = "destructive";

      return (
        <Badge variant={variant} className="capitalize">
          {status ?? 'N/A'}
        </Badge>
      );
    },
    // Add filtering later
  },
  {
    accessorKey: "excuseReason",
    header: "Excuse Reason",
    cell: ({ row }) => row.getValue("excuseReason") ?? 'N/A',
  },
  {
    accessorKey: "notes",
    header: "Notes",
    cell: ({ row }) => (
        <div className="truncate max-w-[200px]" title={row.getValue("notes") ?? ''}>
            {row.getValue("notes") ?? 'N/A'}
        </div>
    ),
  },
  // Add actions column later
]; 