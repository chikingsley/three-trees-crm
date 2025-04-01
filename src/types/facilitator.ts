import type { Facilitator } from '@prisma/client';

// Define the shape of the Facilitator data after serialization from the API
export type SerializableFacilitator = Omit<Facilitator, 'id' | 'createdAt' | 'updatedAt'> & {
  id: string;
  createdAt: string;
  updatedAt: string;
}; 