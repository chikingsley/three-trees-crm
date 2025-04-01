import type { PaymentAllocation } from '@prisma/client';

// Define the shape of the PaymentAllocation data after serialization from the API
export type SerializablePaymentAllocation = Omit<PaymentAllocation, 'id' | 'paymentId' | 'enrollmentId' | 'createdAt' | 'updatedAt'> & {
  id: string;
  paymentId: string;
  enrollmentId: string;
  createdAt: string;
  updatedAt: string;
  // amount is already a number (Float), so it's fine
}; 