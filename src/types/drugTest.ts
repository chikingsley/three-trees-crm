import type { DrugTest } from '@prisma/client';

// Define the shape of the DrugTest data after serialization from the API
export type SerializableDrugTest = Omit<DrugTest, 'id' | 'clientId' | 'testDate' | 'createdAt' | 'updatedAt'> & {
  id: string;
  clientId: string;
  testDate: string;
  createdAt: string;
  updatedAt: string;
}; 