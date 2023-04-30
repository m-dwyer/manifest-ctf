import { PrismaClient } from "@prisma/client";
import { hashSync } from "bcrypt";
const prisma = new PrismaClient();

async function createCategory({ name }: { name: string }) {
  await prisma.category.upsert({
    where: { name },
    update: { name },
    create: { name },
  });
}

async function createUser({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  await prisma.user.upsert({
    where: { email },
    create: { email, password },
    update: { email, password },
  });
}

async function main() {
  createCategory({ name: "Default" });
  createCategory({ name: "Binary exploitation" });
  createCategory({ name: "Crytography" });

  createUser({
    email: "foo@bar.com",
    password: hashSync("aaaaaaaa", 10),
  });
  createUser({ email: "bar@baz.com", password: hashSync("aaaaaaaa", 10) });

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
        categoryId: 1,
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
