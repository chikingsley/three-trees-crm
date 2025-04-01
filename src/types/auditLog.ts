import type { AuditLog } from '@prisma/client';
import { JsonValue } from '@prisma/client/runtime/library'; // Import JsonValue

// Define the shape of the AuditLog data after serialization from the API
export type SerializableAuditLog = Omit<AuditLog, 'id' | 'userId' | 'changeTimestamp' | 'changedFields'> & {
  id: string;
  userId: string | null; // Serialized from BigInt?
  changeTimestamp: string;
  changedFields: JsonValue | null; // JSON fields are already serializable
}; 