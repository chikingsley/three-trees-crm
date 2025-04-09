"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CheckedState } from "@radix-ui/react-checkbox"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Phone, DollarSign, MessageCircle, FileText, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Loader2 } from "lucide-react" 
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { useMutation } from "convex/react";
import { api } from "@/_generated/api";
import { Id } from "@/_generated/dataModel";
import { toast } from "sonner"; 
import { useState } from "react"; 
import { ConfirmationDialog } from "@/components/ConfirmationDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { type FollowUpOption } from "../../../convex/clients"; // Correct the relative path

export const OnboardingStatusOptions = [
  "Initiation",
  "Payment Pending",
  "Documentation Pending",
  "Complete",
  "Initial Contact",
  "Form Submitted",
  "Payment Confirmed"
] as const;

export const FollowUpOptions = [
  "Call Client for Onboarding",
  "Send Valent Sign-Up SMS",
  "Confirm Valent Signup",
  "Send Payment Link SMS",
  "🤖 Confirm Payment",
  "Send DocSign Link SMS",
  "🤖 Confirm Documentation",
  "Assign to Class",
  "Admin Call",
  null
] as const;

export type Client = {
  _id: Id<"clients">;
  _creationTime: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  referralSource?: string;
  onboardingStatus?: typeof OnboardingStatusOptions[number];
  followUp?: typeof FollowUpOptions[number];
};

// --- COLUMN DEFINITIONS ---
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
  {
    accessorKey: "firstName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="First Name" />
    ),
    cell: ({ row }) => <div>{row.getValue("firstName") || "N/A"}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "lastName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Name" />
    ),
    cell: ({ row }) => <div>{row.getValue("lastName") || "N/A"}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => <div>{row.getValue("email") || "N/A"}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
    cell: ({ row }) => <div>{row.getValue("phone") || "N/A"}</div>,
    enableSorting: true, 
    enableHiding: true,
  },
  {
    accessorKey: "referralSource",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Referral Source" />
    ),
    cell: ({ row }) => <div>{row.getValue("referralSource") || "N/A"}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "_creationTime",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => {
      const timestamp = row.getValue("_creationTime") as number;
      if (isNaN(timestamp)) {
        return <div>Invalid Date</div>;
      }
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) { 
        return <div>Invalid Date</div>;
      }
      return <div>{date.toLocaleDateString()}</div>;
    },
    enableSorting: true,
    enableHiding: true,
  },
  // --- MODIFIED Onboarding Status Column ---
  {
    accessorKey: "onboardingStatus",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Onboarding Status" />
    ),
    cell: ({ row }) => {
      const status = row.original.onboardingStatus;
      return <div>{status || "N/A"}</div>;
    },
    enableSorting: true,
    enableHiding: true,
  },
  // --- MODIFIED Follow Up Column ---
  {
    accessorKey: "followUp",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Next Follow Up" />
    ),
    cell: ({ row }) => {
      const currentFollowUp = row.original.followUp;
      const clientId = row.original._id;
      const clientName = row.original.firstName || `Client ${clientId.substring(clientId.length - 4)}`;

      const completeManualFollowUp = useMutation(api.clients.completeManualFollowUp);
      const [isPending, setIsPending] = useState(false);

      const handleCheckboxChange = async (checked: CheckedState) => {
        if (checked === true && !isPending) {
          setIsPending(true);
          toast.info(`Updating task for ${clientName}...`);
          try {
            const result = await completeManualFollowUp({ clientId });
            if (result?.success === false) {
              toast.error(`Failed for ${clientName}: ${result.message || 'Could not complete task.'}`);
            } else {
              toast.success(`Task completed for ${clientName}.`);
            }
          } catch (error: any) {
            console.error("Failed to complete manual follow up:", error);
            toast.error(`Error updating task for ${clientName}: ${error.message || 'Unknown error'}`);
          } finally {
            setIsPending(false); 
          }
        }
      };

      if (currentFollowUp === null) {
        return <div className="text-green-600 font-semibold">Completed</div>;
      }

      if (typeof currentFollowUp === 'string' && currentFollowUp.startsWith("🤖")) {
        return (
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>{currentFollowUp}</span>
          </div>
        );
      }

      if (typeof currentFollowUp === 'string') {
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`followUp-${clientId}`}
              checked={false}
              onCheckedChange={handleCheckboxChange}
              disabled={isPending}
              aria-label={`Mark ${currentFollowUp} as complete for ${clientName}`}
            />
            {isPending && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            <label
              htmlFor={`followUp-${clientId}`}
              className={`cursor-pointer ${isPending ? 'text-muted-foreground italic' : ''}`}
            >
              {currentFollowUp}
            </label>
          </div>
        );
      }

      return <div className="text-muted-foreground">N/A</div>;
    },
    enableSorting: true,
    enableHiding: true,
  },
  // --- Actions Column (Keep as is or modify as needed) ---
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
  // --- Dropdown Menu Column ---
  {
    id: "dropdown",
    cell: ({ row }) => {
      const client = row.original;
      const clientId = client._id;
      const clientName = client.firstName || `Client ${clientId.substring(clientId.length - 4)}`;

      // Mutations for dialog actions
      const manualSetFollowUpMutation = useMutation(api.clients.manualSetFollowUp);
      const deleteClientMutation = useMutation(api.clients.deleteClient);

      // State for the select dropdown in the "Set Follow-up" dialog
      const [selectedFollowUp, setSelectedFollowUp] = useState<SelectFollowUpValue>('');

      // Handler for confirming Set Follow-up
      const handleSetFollowUpConfirm = async () => {
        if (!selectedFollowUp) {
           toast.error("Please select a follow-up status.");
           throw new Error("No follow-up status selected"); // Prevent dialog closing
        }
        const valueToSend = selectedFollowUp === "NULL" ? null : selectedFollowUp;
        toast.info(`Setting follow-up for ${clientName}...`);
        try {
          const result = await manualSetFollowUpMutation({
            clientId: clientId,
            newFollowUp: valueToSend as FollowUpOption,
          });
          if (result?.success) {
             toast.success(`Follow-up set to "${result.newFollowUp ?? 'Completed'}" for ${clientName}.`);
             setSelectedFollowUp(''); // Reset select
          } else {
             toast.error(`Failed to set follow-up: ${result?.message || 'Unknown error'}`);
             throw new Error(result?.message || "Failed to set follow-up"); // Prevent dialog closing
          }
        } catch (error: any) {
           toast.error(`Error setting follow-up: ${error.message || 'Unknown error'}`);
           throw error; // Re-throw to keep dialog open via ConfirmationDialog's catch
        }
      };

      // Handler for confirming Delete Client
      const handleDeleteConfirm = async () => {
        toast.info(`Deleting ${clientName}...`);
        try {
           const result = await deleteClientMutation({ clientId });
           if (result?.success) {
              toast.success(`${clientName} deleted successfully.`);
              // Row should disappear automatically due to data refetch/update
           } else {
              toast.error(`Failed to delete ${clientName}: ${result?.message || 'Unknown error'}`);
              throw new Error(result?.message || "Failed to delete client"); // Prevent dialog closing
           }
        } catch (error: any) {
           toast.error(`Error deleting ${clientName}: ${error.message || 'Unknown error'}`);
           throw error; // Re-throw to keep dialog open
        }
      };

      // Content for the Set Follow-up Dialog
      const setFollowUpDialogContent = (
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor={`followup-select-${clientId}`} className="text-right">
            Status
          </Label>
          <Select
             value={selectedFollowUp}
             onValueChange={(value: SelectFollowUpValue) => setSelectedFollowUp(value)}
          >
            <SelectTrigger id={`followup-select-${clientId}`} className="col-span-3">
              <SelectValue placeholder="Select new follow-up..." />
            </SelectTrigger>
            <SelectContent>
              {manualSetFollowUpOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(clientId)}
            >
              Copy client ID
            </DropdownMenuItem>

            {/* --- Set Follow-up Action --- */}
            <ConfirmationDialog
              trigger={<DropdownMenuItem onSelect={(e) => e.preventDefault()}>Set Follow-up...</DropdownMenuItem>}
              title={`Set Follow-up for ${clientName}`}
              description="Manually select the next follow-up step. This will also update the onboarding status accordingly."
              content={setFollowUpDialogContent}
              onConfirm={handleSetFollowUpConfirm}
              confirmText="Set Status"
            />

            <DropdownMenuSeparator />

             {/* --- Delete Client Action --- */}
             <ConfirmationDialog
               trigger={<DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600 focus:text-red-600 focus:bg-red-50">Delete Client...</DropdownMenuItem>}
               title={`Delete Client: ${clientName}`}
               description={<span className="font-semibold text-red-600">This action cannot be undone. This will permanently delete the client record.</span>}
               onConfirm={handleDeleteConfirm}
               confirmText="Delete Client"
               isDestructive={true}
             />

          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];

// --- Define Follow-up options for the Select dropdown (MOVED OUTSIDE CELL) ---
const manualSetFollowUpOptions = [
  { value: "NULL", label: "Completed (Set to Null)" }, // Special case for null
  { value: "Admin Call", label: "Admin Call" },
  { value: "Call Client for Onboarding", label: "Call Client for Onboarding" },
  { value: "Send Valent Sign-Up SMS", label: "Send Valent Sign-Up SMS" },
  { value: "Confirm Valent Signup", label: "Confirm Valent Signup" },
  { value: "Send Payment Link SMS", label: "Send Payment Link SMS" },
  { value: "🤖 Confirm Payment", label: "🤖 Confirm Payment" },
  { value: "Send DocSign Link SMS", label: "Send DocSign Link SMS" },
  { value: "🤖 Confirm Documentation", label: "🤖 Confirm Documentation" },
  { value: "Assign to Class", label: "Assign to Class" },
];

// Type for the select value state (MOVED OUTSIDE CELL)
type SelectFollowUpValue = (typeof manualSetFollowUpOptions)[number]['value'] | '';
