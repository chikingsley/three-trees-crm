import { PrismaClient } from '@prisma/client';

// --- IMPORTANT --- 
// Ensure you have the DATABASE_URL environment variable set in your .env file
// pointing to your Supabase instance.
// e.g., DATABASE_URL="postgresql://user:password@host:port/database"
// --- 

const prisma = new PrismaClient();

async function runCrudExamples() {
  let createdClientId: bigint | null = null; // Use bigint for Prisma IDs
  try {
    // --- CREATE --- 
    console.log("--- Inserting a new client using Prisma ---");
    const newClientData = {
      firstName: "Alice",        // Updated field name
      lastName: "Wonderland",   // Updated field name
      phone: "555-1234",
      email: "alice.prisma@example.com", // Changed email to avoid potential unique constraint conflict
      classType: "Group",
      classStatus: "Pending",
      notes: "Initial consultation booked via Prisma."
    };

    const insertedClient = await prisma.client.create({
      data: newClientData,
    });
    console.log("Inserted Client:", insertedClient);

    if (!insertedClient) {
      console.error("Insertion failed!");
      return;
    }
    createdClientId = insertedClient.id; // Store the ID for later steps

    // --- READ (Single) ---
    console.log(`\n--- Fetching client with ID: ${createdClientId} using Prisma ---`);
    const fetchedClient = await prisma.client.findUnique({
      where: { id: createdClientId },
    });
    console.log("Fetched Client:", fetchedClient);

    // --- READ (Multiple) ---
    console.log("\n--- Fetching all clients using Prisma ---");
    const allClients = await prisma.client.findMany({
      take: 10, // Limit results
      select: { // Select specific fields
        id: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    });
    console.log("All Clients (limit 10):", allClients);

    // --- UPDATE --- 
    console.log(`\n--- Updating client with ID: ${createdClientId} using Prisma ---`);
    const updatedStatus = "Active";
    const updatedNotes = "First session completed via Prisma.";

    const updatedClient = await prisma.client.update({
      where: { id: createdClientId },
      data: {
        classStatus: updatedStatus,
        notes: updatedNotes,
      },
    });
    console.log("Updated Client:", updatedClient);

    // --- DELETE --- 
    console.log(`\n--- Deleting client with ID: ${createdClientId} using Prisma ---`);
    const deleteResult = await prisma.client.delete({
      where: { id: createdClientId },
    });
    console.log("Delete Result:", deleteResult); // Prisma delete returns the deleted object

    // Verify deletion (optional)
    const checkDeleted = await prisma.client.findUnique({
      where: { id: createdClientId },
    });
    if (!checkDeleted) {
      console.log(`Client with ID ${createdClientId} successfully deleted.`);
    } else {
      console.error(`Failed to delete client with ID ${createdClientId}.`);
    }
    createdClientId = null; // Clear the ID after successful deletion

  } catch (error) {
    console.error("\n--- Prisma CRUD Example Failed ---");
    console.error(error);
  } finally {
    // --- CLEANUP (in case of error before delete) ---
    if (createdClientId) {
      console.log(`\n--- Cleaning up created client ID: ${createdClientId} ---`);
      try {
        await prisma.client.delete({ where: { id: createdClientId } });
        console.log(`Cleanup successful for client ID: ${createdClientId}`);
      } catch (cleanupError) {
        console.error(`Cleanup failed for client ID ${createdClientId}:`, cleanupError);
      }
    }

    // Disconnect Prisma client
    await prisma.$disconnect();
    console.log("\nPrisma client disconnected.");
  }
}

runCrudExamples(); 