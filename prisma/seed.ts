import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  for (let i = 1; i <= 50; i++) {
    const challenge = await prisma.challenge.upsert({
      where: { id: i },
      update: {},
      create: {
        created_at: new Date(),
        name: `My Challenge ${i}`,
        description: `challenge ${i} description here`,
        flag: `my_flag${i}`,
        points: 100,
      },
    });
    console.log("created challenge: ", challenge);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
