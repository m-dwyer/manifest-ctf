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

async function createChallengeAttempt({
  userId,
  challengeId,
  pointsScored,
  completed,
  attempts,
}: {
  userId: string;
  challengeId: string;
  pointsScored: number;
  completed: Date;
  attempts: number;
}) {
  await prisma.challengeAttempt.upsert({
    where: {
      userId_challengeId: {
        userId: Number(userId),
        challengeId: Number(challengeId),
      },
    },
    update: {
      userId: Number(userId),
      challengeId: Number(challengeId),
      points_scored: pointsScored,
      completed: completed.toISOString(),
      attempts: attempts,
    },
    create: {
      userId: Number(userId),
      challengeId: Number(challengeId),
      points_scored: pointsScored,
      completed: completed.toISOString(),
      attempts: attempts,
    },
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

  const CHALLENGE_COUNT = 50;

  for (let i = 1; i <= CHALLENGE_COUNT; i++) {
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
    console.log(`Created challenges`);
  }

  for (let i = 1; i <= 2; i++) {
    const completedDate = new Date("2023-04-01 11:00:00");
    for (let j = 1; j <= 10; j++) {
      createChallengeAttempt({
        userId: i.toString(),
        challengeId: j.toString(),
        pointsScored: 50 + j * 50,
        completed: completedDate,
        attempts: 1 + j,
      });
      completedDate.setDate(completedDate.getDate() + 1);
    }
    console.log(`Created completed challenge attempts for user id ${i}`);
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
