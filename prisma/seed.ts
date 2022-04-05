import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const email = "rachel@remix.run";

  // cleanup the existing database
  // await prisma.user.delete({ where: { email } }).catch(() => {
  //   // no worries if it doesn't exist yet
  // });

  await prisma.transactions.deleteMany({}).catch(() => {
    // no worries if it doesn't exist yet
  });

  // const hashedPassword = await bcrypt.hash("racheliscool", 10);

  // const user = await prisma.user.create({
  //   data: {
  //     email,
  //     password: {
  //       create: {
  //         hash: hashedPassword,
  //       },
  //     },
  //   },
  // });

  // await prisma.note.create({
  //   data: {
  //     title: "My first note",
  //     body: "Hello, world!",
  //     userId: user.id,
  //   },
  // });

  // await prisma.note.create({
  //   data: {
  //     title: "My second note",
  //     body: "Hello, world!",
  //     userId: user.id,
  //   },
  // });

  await prisma.transactions.create({
    data: { payer: "DANNON", points: 1000, timestamp: "2020-11-02T14:00:00Z" },
  });
  await prisma.transactions.create({
    data: { payer: "UNILEVER", points: 200, timestamp: "2020-10-31T11:00:00Z" },
  });
  await prisma.transactions.create({
    data: { payer: "DANNON", points: -200, timestamp: "2020-10-31T15:00:00Z" },
  });
  await prisma.transactions.create({
    data: {
      payer: "MILLER COORS",
      points: 10000,
      timestamp: "2020-11-01T14:00:00Z",
    },
  });
  await prisma.transactions.create({
    data: { payer: "DANNON", points: 300, timestamp: "2020-10-31T10:00:00Z" },
  });
  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
