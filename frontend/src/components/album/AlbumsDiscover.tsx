import { AlbumService } from "@/services/albumService";
import type { AlbumFeed } from "@/types/album";
import { useEffect, useState } from "react";
import Album from "./Album";
import AlbumModal from "./AlbumModal";

const AlbumsDiscover = () => {
  const [feedAlbums, setFeedAlbums] = useState<AlbumFeed[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<AlbumFeed | null>(null);

  const handleAlbumLike = (albumId: string, newIsLiked: boolean) => {
    setFeedAlbums((prevAlbums) =>
      prevAlbums.map((album) =>
        album.id === albumId
          ? {
              ...album,
              isLiked: newIsLiked,
              numLikes: newIsLiked ? album.numLikes + 1 : album.numLikes - 1,
            }
          : album,
      ),
    );
  };

  useEffect(() => {
    try {
      const fetchAlbums = async () => {
        const AlbumsData = await AlbumService.getDiscoverAlbums();
        setFeedAlbums(AlbumsData.discover);
      };

      fetchAlbums();
    } catch (error) {
      console.error("Error fetching Albums:", error);
    }
  }, []);

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
      {feedAlbums.map((album) => (
        <div
          key={album.id}
          className="cursor-pointer transition-transform hover:scale-[1.02]"
        >
          <Album
            album={album}
            handleClickAlbum={() => setSelectedAlbum(album)}
            handleLikeAlbum={handleAlbumLike}
          />
        </div>
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

export default AlbumsDiscover;
