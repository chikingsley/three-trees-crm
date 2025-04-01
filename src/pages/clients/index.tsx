"use client"; // Add this if not already present

import { useState, useEffect } from 'react';
import { columns } from "@/components/clients/columns";
import { DataTable } from "@/components/data-table";
import { SerializableClient } from "@/types/client"; 

export default function ClientsPage() {
  const [clients, setClients] = useState<SerializableClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/clients');
        if (!response.ok) {
          throw new Error(`Failed to fetch clients: ${response.statusText}`);
        }
        const data: SerializableClient[] = await response.json();
        setClients(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(errorMessage);
        console.error("Failed to fetch clients:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []); // Fetch data on component mount

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-10">
        <p>Loading clients...</p>
        {/* Optional: Add a spinner component */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-10 px-4 text-center">
        <h2 className="text-xl font-semibold text-destructive">Error Loading Clients</h2>
        <p className="text-muted-foreground">{error}</p>
        <p className="text-sm text-muted-foreground">Please try refreshing the page or contact support if the problem persists.</p>
      </div>
    );
  }

  // Ensure columns type matches SerializableClient if needed
  // If your `columns` file expects the raw Prisma `Client` type, you might need to adjust it
  // or adjust the type here.
  // For now, we assume `columns` works with SerializableClient or is compatible.

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <h1 className="text-2xl font-bold mb-4">Clients</h1>
        <p className="text-muted-foreground mb-6">Manage your client relationships</p>
      </div>
      {/* Render DataTable directly, padding is now inside the component */}
      <DataTable columns={columns} data={clients} />
    </div>
  );
} 