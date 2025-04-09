"use client";


import { useState, useEffect } from 'react';
import { DataTable } from "@/components/data-table/data-table";
import { columns as clientColumns } from "@/components/clients/columns";
import { SerializableClient } from "@/types/client";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { SectionCards } from "@/components/section-cards";
import { NavigationProps } from "@/App";

export default function HomePage({ navigate }: NavigationProps) {
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
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-10">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-10 px-4 text-center">
        <h2 className="text-xl font-semibold text-destructive">Error Loading Dashboard</h2>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p className="text-muted-foreground mb-6">Overview of recent activity.</p>
      </div>
      <SectionCards />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      <h2 className="text-xl font-semibold mb-3 px-4 lg:px-6">Recent Clients</h2>
      <DataTable columns={clientColumns} data={clients} />
    </div>
  );
} 