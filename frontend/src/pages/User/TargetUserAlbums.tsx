import AlbumModal from "@/components/album/AlbumModal";
import TargetAlbumUser from "@/components/album/TargetAlbumUser";
import { UserService } from "@/services/user.service";
import { useAuthStore } from "@/store/authStore";
import type { Album } from "@/types/album";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const TargetUserAlbums = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const user = useAuthStore((state) => state.user);
  const { id: publicUserId } = useParams<{ id: string }>();
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetchAlbums = async () => {
      try {
        const fetchedAlbums =
          await UserService.getTargetUserUserAlbums(publicUserId);
        setAlbums(fetchedAlbums);
      } catch (error) {
        console.error("Error fetching albums:", error);
      }
    };

    fetchAlbums();
  }, [user, publicUserId]);

  if (albums.length === 0) {
    return <div>No albums available.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {albums.map((album) => (
        <TargetAlbumUser
          key={album.id}
          album={album}
          handleClickAlbum={() => {
            setSelectedAlbum(album);
          }}
        />
      ))}

      <AlbumModal
        isOpen={selectedAlbum !== null}
        onClose={() => setSelectedAlbum(null)}
        title={selectedAlbum?.title || ""}
        description={selectedAlbum?.description || ""}
        photos={selectedAlbum?.photos || []}
      />
    </div>
  );
};

export default TargetUserAlbums;
