import { prisma } from "#controllers/config/db.js";

async function main() {
  const users = await prisma.user.findMany({ select: { id: true } });
  const photos = await prisma.photo.findMany({ select: { id: true } });

  if (users.length === 0 || photos.length === 0) {
    console.log("Skipping photoLike seed because users or photos are missing.");
    return;
  }

  const photoLikeData: Array<{ userId: string; photoId: string }> = [];
  const seenPairs = new Set<string>();

  for (const photo of photos) {
    const maxLikes = Math.min(15, users.length);
    const numberOfLikes = Math.floor(Math.random() * maxLikes) + 1;
    const shuffledUsers = [...users].sort(() => Math.random() - 0.5);

    for (const user of shuffledUsers.slice(0, numberOfLikes)) {
      const pairKey = `${photo.id}:${user.id}`;

      if (seenPairs.has(pairKey)) {
        continue;
      }

      seenPairs.add(pairKey);
      photoLikeData.push({
        photoId: photo.id,
        userId: user.id,
      });
    }
  }

  if (photoLikeData.length === 0) {
    console.log("No photo likes generated.");
    return;
  }

  await prisma.photoLike.createMany({
    data: photoLikeData,
    skipDuplicates: true,
  });

  console.log(`Seeded ${photoLikeData.length} photo likes.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
