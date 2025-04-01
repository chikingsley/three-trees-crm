import type { Enrollment } from '@prisma/client';

// Define the shape of the Enrollment data after serialization from the API
export type SerializableEnrollment = Omit<Enrollment, 'id' | 'clientId' | 'classId' | 'enrollmentDate' | 'terminationDate' | 'reEnrollmentDate' | 'completionDate' | 'createdAt' | 'updatedAt'> & {
  id: string;
  clientId: string;
  classId: string;
  enrollmentDate: string;
  terminationDate: string | null;
  reEnrollmentDate: string | null;
  completionDate: string | null;
  createdAt: string;
  updatedAt: string;
}; 