import type { User } from '@prisma/client';

// Define the shape of the User data after serialization from the API
export type SerializableUser = Omit<User, 'id' | 'createdAt' | 'updatedAt'> & {
  id: string;
  createdAt: string;
  updatedAt: string;
}; 