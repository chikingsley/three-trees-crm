import type { Payment, Client } from "@prisma/client"; // Import base types

// Define the shape of the Payment data after serialization from the API
// Includes clientName added during serialization
export type SerializablePayment = Omit<Payment, 'id' | 'clientId' | 'paymentDate' | 'createdAt' | 'updatedAt'> & {
  id: string;
  clientId: string;
  paymentDate: string;
  createdAt: string;
  updatedAt: string;
  clientName?: string; // Example: Client name added in API
  client?: Partial<Pick<Client, 'firstName' | 'lastName'>>; // Example: If raw client data might be included
  // amount is already a number (Float), so it's fine
}; 