import type { FacilitatorAssignment } from '@prisma/client';

// Define the shape of the FacilitatorAssignment data after serialization from the API
export type SerializableFacilitatorAssignment = Omit<FacilitatorAssignment, 'id' | 'facilitatorId' | 'classId' | 'assignmentStartDate' | 'assignmentEndDate' | 'createdAt' | 'updatedAt'> & {
  id: string;
  facilitatorId: string;
  classId: string;
  assignmentStartDate: string;
  assignmentEndDate: string | null;
  createdAt: string;
  updatedAt: string;
}; 