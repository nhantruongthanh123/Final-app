import { faker } from "@faker-js/faker";
import { prisma } from "../../src/config/db.js";

async function main() {
  console.log("Seeding 20 users...");

  const users = Array.from({ length: 20 }).map(() => ({
    email: faker.internet.email(),
    password: "hashedpassword123",
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    avatarUrl: faker.image.avatar(),
  }));

  await prisma.user.createMany({
    data: users,
  });

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
