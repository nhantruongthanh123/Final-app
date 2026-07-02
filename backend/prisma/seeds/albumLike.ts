import { prisma } from "#/config/db.js";

async function main() {
  const users = await prisma.user.findMany({ select: { id: true } });
  const albums = await prisma.album.findMany({ select: { id: true } });

  if (users.length === 0 || albums.length === 0) {
    console.log("Skipping albumLike seed because users or albums are missing.");
    return;
  }

  const albumLikeData: Array<{ userId: string; albumId: string }> = [];
  const seenPairs = new Set<string>();

  for (const album of albums) {
    const maxLikes = Math.min(15, users.length);
    const numberOfLikes = Math.floor(Math.random() * maxLikes) + 1;
    const shuffledUsers = [...users].sort(() => Math.random() - 0.5);

    for (const user of shuffledUsers.slice(0, numberOfLikes)) {
      const pairKey = `${album.id}:${user.id}`;

      if (seenPairs.has(pairKey)) {
        continue;
      }

      seenPairs.add(pairKey);
      albumLikeData.push({
        albumId: album.id,
        userId: user.id,
      });
    }
  }

  if (albumLikeData.length === 0) {
    console.log("No album likes generated.");
    return;
  }

  await prisma.albumLike.createMany({
    data: albumLikeData,
    skipDuplicates: true,
  });

  console.log(`Seeded ${albumLikeData.length} album likes.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
