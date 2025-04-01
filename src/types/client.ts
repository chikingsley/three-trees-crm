import type { Client } from '@prisma/client'; // Import the base Prisma type

// Define the shape of the Client data after serialization from the API
export type SerializableClient = Omit<Client, 'id' | 'createdAt' | 'updatedAt'> & {
  id: string;
  createdAt: string;
  updatedAt: string;
  // currentBalance is already a number (Float), so it's fine
}; 