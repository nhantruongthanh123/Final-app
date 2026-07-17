import AlbumUser from "@/components/album/AlbumUser";
import EmptyState from "@/components/shared/EmptyState";
import { UserService } from "@/services/user.service";
import { useAuthStore } from "@/store/authStore";
import type { Album } from "@/types/album";
import { ImageOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Albums = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

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
    return (
      <EmptyState
        icon={<ImageOff className="w-10 h-10 text-orange-400" />}
        title={"You haven't created any albums yet."}
        description={
          "Create your first album by uploading your photos. Click the button below to get started!"
        }
        actionLabel={"Create Album"}
        onAction={() => {
          navigate("/albums/add");
        }}
      />
    );
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
