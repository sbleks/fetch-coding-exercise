import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  await prisma.transactions.deleteMany({}).catch(() => {
    // no worries if it doesn't exist yet
  });

  console.log(`Database has been cleared. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
