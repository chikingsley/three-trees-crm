import type { Class } from '@prisma/client';

// Define the shape of the Class data after serialization from the API
export type SerializableClass = Omit<Class, 'id' | 'classTypeId' | 'time' | 'startDate' | 'endDate'> & {
  id: string;
  classTypeId: string;
  time: string; // Serialized from DateTime with @db.Time
  startDate: string; // Serialized from DateTime with @db.Date
  endDate: string | null; // Serialized from DateTime? with @db.Date
}; 