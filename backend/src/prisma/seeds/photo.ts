import { prisma } from "#config/db.js";
import { faker } from "@faker-js/faker";

async function main() {
  const users = await prisma.user.findMany({ select: { id: true } });
  if (users.length === 0) return;

  // 1. Seed Photos independently
  const photoData = Array.from({ length: 100 }).map(() => ({
    photoUrl: faker.image.url(),
    title: faker.lorem.words(3),
    description: faker.lorem.sentence(),
    userId: users[Math.floor(Math.random() * users.length)].id,
    isPublic: true,
  }));
  await prisma.photo.createMany({ data: photoData });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
