"use client";

import React, { useState, useEffect } from 'react';
import { DataTable } from "@/components/data-table";
import { columns } from "@/components/payments/columns"; 
import { SerializablePayment } from "@/types/payment"; 

export default function PaymentsPage() {
  const [payments, setPayments] = useState<SerializablePayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/payments'); // Fetch from the new endpoint
        if (!response.ok) {
          throw new Error(`Failed to fetch payments: ${response.statusText}`);
        }
        const data: SerializablePayment[] = await response.json();
        setPayments(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(errorMessage);
        console.error("Failed to fetch payments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []); // Fetch data on component mount

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-10">
        <p>Loading payments...</p>
        {/* Optional: Add a spinner component */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-10 px-4 text-center">
        <h2 className="text-xl font-semibold text-destructive">Error Loading Payments</h2>
        <p className="text-muted-foreground">{error}</p>
        <p className="text-sm text-muted-foreground">Please try refreshing the page or contact support if the problem persists.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <h1 className="text-2xl font-bold mb-4">Payments</h1>
        <p className="text-muted-foreground mb-6">Track and manage client payments</p>
      </div>
      {/* Pass the correct columns and fetched payments data */}
      <DataTable columns={columns} data={payments} />
    </div>
  );
} 