"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { SerializablePayment } from "@/types/payment"; // Import from centralized location

// Helper to format currency
const formatCurrency = (amount: number | null | undefined) => {
  if (amount == null) return 'N/A';
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

// Helper to format date
const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString(); // Adjust format as needed
};

export const columns: ColumnDef<SerializablePayment>[] = [
  // Column for Client Name
  {
    accessorKey: "clientName", // Use the pre-formatted clientName from API
    header: "Client",
    cell: ({ row }) => row.getValue("clientName") ?? 'N/A',
    // Optional: Enable sorting/filtering based on clientName
  },
  // Column for Payment Date
  {
    accessorKey: "paymentDate",
    header: "Payment Date",
    cell: ({ row }) => formatDate(row.getValue("paymentDate")),
    enableSorting: true,
  },
  // Column for Amount
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>, // Align header right
    cell: ({ row }) => (
      <div className="text-right font-medium">
        {formatCurrency(row.getValue("amount"))}
      </div>
    ),
    enableSorting: true,
  },
  // Column for Payment Type
  {
    accessorKey: "paymentType",
    header: "Type",
    cell: ({ row }) => (
      <Badge variant="outline" className="capitalize">
        {row.getValue("paymentType") ?? 'N/A'}
      </Badge>
    ),
    // Optional: Filter by type later
  },
  // Column for Payment Reason
  {
    accessorKey: "paymentReason",
    header: "Reason",
    cell: ({ row }) => row.getValue("paymentReason") ?? 'N/A',
  },
  // Column for Notes
  {
    accessorKey: "notes",
    header: "Notes",
    cell: ({ row }) => (
        <div className="truncate max-w-[200px]" title={row.getValue("notes") ?? ''}>
            {row.getValue("notes") ?? 'N/A'}
        </div>
    ),
  },
  // TODO: Add actions column later (View Details, Allocate, etc.)
]; 