import { faker } from "@faker-js/faker";
import { prisma } from "../../src/config/db.js";

async function main() {
  const users = await prisma.user.findMany({ select: { id: true } });
  if (users.length === 0) return;

  const albumData = Array.from({ length: 50 }).map(() => ({
    title: faker.commerce.productName(),
    description: faker.lorem.sentence(),
    userId: users[Math.floor(Math.random() * users.length)].id,
    // Generate an array of random image URLs directly
    photos: Array.from({ length: 3 }).map(() => faker.image.url()),
    isPublic: true,
  }));
  await prisma.album.createMany({ data: albumData });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
