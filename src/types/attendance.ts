import type { Attendance, Client, Enrollment } from '@prisma/client';

// Define the shape of the Attendance data after serialization from the API
export type SerializableAttendance = Omit<Attendance, 'id' | 'enrollmentId' | 'attendanceDateId' | 'createdAt' | 'updatedAt'> & {
  id: string;
  enrollmentId: string;
  attendanceDateId: string;
  createdAt: string;
  updatedAt: string;
};

// Type representing the actual data structure returned by the /api/attendance endpoint
export type ApiAttendanceRecord = SerializableAttendance & {
  clientName?: string; // Added in API
  attendanceActualDate?: string; // Added and formatted in API
  // Optional: Include raw nested data types if the API might return them (depends on API implementation)
  // enrollment?: Enrollment & { client?: Partial<Pick<Client, 'firstName' | 'lastName'>> };
  // attendanceDate?: { date: Date };
}; 