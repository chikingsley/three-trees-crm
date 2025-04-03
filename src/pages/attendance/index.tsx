"use client";

import { useState, useEffect } from 'react';
import { DataTable } from "@/components/data-table/data-table";
import { columns } from "@/components/attendance/columns";
import { ApiAttendanceRecord } from "@/types/attendance";

export default function AttendancePage() {
  const [attendance, setAttendance] = useState<ApiAttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAttendance = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/attendance');
        if (!response.ok) {
          throw new Error(`Failed to fetch attendance: ${response.statusText}`);
        }
        // Expect the API to return data matching ApiAttendanceRecord
        const data: ApiAttendanceRecord[] = await response.json();
        setAttendance(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(errorMessage);
        console.error("Failed to fetch attendance:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-10">
        <p>Loading attendance records...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-10 px-4 text-center">
        <h2 className="text-xl font-semibold text-destructive">Error Loading Attendance</h2>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <h1 className="text-2xl font-bold mb-4">Attendance</h1>
        <p className="text-muted-foreground mb-6">Track client attendance</p>
      </div>
      <DataTable columns={columns} data={attendance} />
    </div>
  );
} 