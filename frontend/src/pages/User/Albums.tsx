import AlbumUser from "@/components/album/AlbumUser";
import { UserService } from "@/services/userService";
import { useAuthStore } from "@/store/authStore";
import type { Album } from "@/types/album";
import { useEffect, useState } from "react";

const Albums = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!user) return;
    const fetchAlbums = async () => {
      try {
        const fetchedAlbums = await UserService.getAllUserAlbums(user.id);
        setAlbums(fetchedAlbums);
      } catch (error) {
        console.error("Error fetching albums:", error);
      }
    };

    fetchAlbums();
  }, [user]);

  if (albums.length === 0) {
    return <div>No albums available.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {albums.map((album) => (
        <AlbumUser key={album.id} album={album} />
      ))}
    </div>
  );
};

export default Albums;
