import { prisma } from "#/config/db.js";

async function main() {
  const users = await prisma.user.findMany({ select: { id: true } });

  if (users.length < 2) {
    console.log("Skipping follow seed: Not enough users to follow each other.");
    return;
  }

  // FIX 1: Updated the TypeScript definition to match your actual schema names
  const followData: Array<{ followerId: string; followedId: string }> = [];
  const seenPairs = new Set<string>();

  for (const user of users) {
    const maxFollows = Math.min(8, users.length - 1); // -1 because they can't follow themselves
    const numberOfFollows = Math.floor(Math.random() * maxFollows) + 1;
    const shuffledUsers = [...users].sort(() => Math.random() - 0.5);

    for (const following of shuffledUsers.slice(0, numberOfFollows)) {
      if (user.id === following.id) {
        continue;
      }

      const pairKey = `${user.id}:${following.id}`;

      if (seenPairs.has(pairKey)) {
        continue;
      }

      seenPairs.add(pairKey);
      followData.push({
        followerId: user.id,
        followedId: following.id,
      });
    }
  }

  if (followData.length === 0) {
    console.log("No follows generated.");
    return;
  }

  await prisma.follow.createMany({
    data: followData,
    skipDuplicates: true,
  });

  console.log(`Seeded ${followData.length} follows successfully!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
