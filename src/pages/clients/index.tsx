"use client";

import { useQuery } from "convex/react"; 
import { api } from "../../../convex/_generated/api"; 
import { columns } from "@/components/clients/columns";
import { DataTable } from "@/components/data-table/data-table";
import { NavigationProps } from "@/App";

export default function ClientsPage({ navigate }: NavigationProps) {
  const clients = useQuery(api.clients.list);

  if (clients === undefined) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-10">
        <p>Loading clients...</p>
        {/* Optional: Add a spinner component */}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <h1 className="text-2xl font-bold mb-4">Clients</h1>
        <p className="text-muted-foreground mb-6">Manage your client relationships</p>
      </div>
      <DataTable columns={columns} data={clients} />
    </div>
  );
}