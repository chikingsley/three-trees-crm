"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Phone, DollarSign, MessageCircle, FileText, AlertCircle } from "lucide-react"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; 
import { useMutation } from "convex/react"; 
import { api } from "@/_generated/api"; 
import { Id } from "@/_generated/dataModel"; 

// Define the types for the dropdown options
export const OnboardingStatusOptions = [
  "Form Submitted",
  "Initial Contact",
  "Payment Pending",
  "Payment Confirmed",
  "Consent Documents Signed",
  "Enrollment Complete",
] as const;

export const FollowUpOptions = [
  "Send Valent Sign-Up SMS",
  "Admin Call",
  "Send Payment Link SMS",
  "Send DocSign Link SMS",
  "Assign to Class",
] as const;

export type Client = {
  _id: Id<"clients">; 
  _creationTime: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  referralSource: string;
  onboardingStatus?: typeof OnboardingStatusOptions[number]; 
  followUp?: typeof FollowUpOptions[number]; 
};

// Reusable component for status dropdowns
const StatusSelect = ({ value, options, onUpdate, clientId }: {
  value?: string;
  options: readonly string[];
  onUpdate: (args: { clientId: Id<"clients">; status: string }) => Promise<unknown>;
  clientId: Id<"clients">;
}) => {
  const handleUpdate = async (newStatus: string) => {
    if (!newStatus || newStatus === value) return; 
    try {
      await onUpdate({ clientId, status: newStatus });
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  return (
    <Select onValueChange={handleUpdate} defaultValue={value ?? "N/A"}>
      <SelectTrigger className="w-[180px] h-8 text-xs">
        <SelectValue placeholder="Select status..." />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option} value={option} className="text-xs">
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export const columns: ColumnDef<Client>[] = [
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
        className="mr-2" 
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="mr-2" 
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "firstName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="First Name" />
    ),
    cell: ({ row }) => <div className="capitalize">{row.getValue("firstName")}</div>,
  },
  {
    accessorKey: "lastName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Name" />
    ),
    cell: ({ row }) => <div className="capitalize">{row.getValue("lastName")}</div>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => <div>{row.getValue("phone")}</div>,
  },
  {
    accessorKey: "referralSource",
    header: "Referral Source",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("referralSource")}</div>
    ),
  },
  {
    accessorKey: "_creationTime",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created On" className="text-left" />
    ),
    cell: ({ row }) => {
      const timestamp = row.getValue("_creationTime") as number;
      const isValidTimestamp = typeof timestamp === 'number' && !isNaN(timestamp);
      const date = isValidTimestamp ? new Date(timestamp) : null;

      if (!date || isNaN(date.getTime())) {
        return <div className="text-left text-red-500 flex items-center"><AlertCircle size={14} className="mr-1"/> Invalid Date</div>;
      }

      const formatted = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      return <div className="text-left">{formatted}</div>
    },
    enableSorting: true,
  },
  {
    id: "onboarding status",
    accessorKey: "onboardingStatus",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Onboarding Status" className="text-left" />
    ),
    cell: function Cell({ row }) {
      const updateStatus = useMutation(api.clients.updateOnboardingStatus);
      return (
        <StatusSelect
          value={row.original.onboardingStatus}
          options={OnboardingStatusOptions}
          onUpdate={updateStatus}
          clientId={row.original._id}
        />
      );
    },
    enableSorting: true,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "Follow up",
    accessorKey: "followUp",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Follow Up" className="text-left" />
    ),
    cell: function Cell({ row }) {
      const updateFollowUp = useMutation(api.clients.updateFollowUp);
      return (
        <StatusSelect
          value={row.original.followUp}
          options={FollowUpOptions}
          onUpdate={updateFollowUp}
          clientId={row.original._id}
        />
      );
    },
    enableSorting: true,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    accessorKey: "Actions",
    cell: ({ row }) => { 
      return (
        <div className="flex space-x-2">
          <Button
            size="icon"
            variant="outline"
            className="h-7 w-7 bg-yellow-50 text-yellow-600 hover:bg-yellow-100"
            title="Payment"
          >
            <DollarSign size={14} />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="h-7 w-7 bg-blue-50 text-blue-600 hover:bg-blue-100"
            title="Call"
          >
            <Phone size={14} />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="h-7 w-7 bg-green-50 text-green-600 hover:bg-green-100"
            title="Message"
          >
            <MessageCircle size={14} />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="h-7 w-7 bg-purple-50 text-purple-600 hover:bg-purple-100"
            title="Documentation"
          >
            <FileText size={14} />
          </Button>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
]
