import AlbumUser from "@/components/album/AlbumUser";
import type { User } from "@/types/user";
import { useEffect, useState } from "react";
import { UserService } from "@/service/userService";
import type { Album } from "@/types/album";

const UserAlbums = ({ user }: { user: User }) => {
  const [albums, setAlbums] = useState<Album[]>([]);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const fetchedAlbums = await UserService.getAllUserAlbums(user.id);
        setAlbums(fetchedAlbums);
      } catch (error) {
        console.error("Error fetching albums:", error);
      }
    };

    fetchAlbums();
  }, [user.id]);

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

export default UserAlbums;
