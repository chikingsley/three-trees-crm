import type { ClassDefinition } from '@prisma/client';

// Define the shape of the ClassDefinition data after serialization from the API
export type SerializableClassDefinition = Omit<ClassDefinition, 'id'> & {
  id: string;
  // Other fields (Int, String, Boolean, Float) are directly serializable
}; 