import type { AttendanceDate } from '@prisma/client';

// Define the shape of the AttendanceDate data after serialization from the API
export type SerializableAttendanceDate = Omit<AttendanceDate, 'id' | 'classId' | 'date' | 'createdAt' | 'updatedAt'> & {
  id: string;
  classId: string;
  date: string; // Serialized from DateTime with @db.Date
  createdAt: string;
  updatedAt: string;
}; 