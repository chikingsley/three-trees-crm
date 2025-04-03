"use client";

import { useState, useEffect } from 'react';
import { DataTable } from "@/components/data-table/data-table";
import { columns } from "@/components/facilitators/columns";
import { SerializableFacilitator } from "@/types/facilitator";

export default function FacilitatorsPage() {
  const [facilitators, setFacilitators] = useState<SerializableFacilitator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFacilitators = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/facilitators');
        if (!response.ok) {
          throw new Error(`Failed to fetch facilitators: ${response.statusText}`);
        }
        const data: SerializableFacilitator[] = await response.json();
        setFacilitators(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(errorMessage);
        console.error("Failed to fetch facilitators:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFacilitators();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-10">
        <p>Loading facilitators...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-10 px-4 text-center">
        <h2 className="text-xl font-semibold text-destructive">Error Loading Facilitators</h2>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <h1 className="text-2xl font-bold mb-4">Facilitators</h1>
        <p className="text-muted-foreground mb-6">Manage facilitators</p>
      </div>
      <DataTable columns={columns} data={facilitators} />
    </div>
  );
} 