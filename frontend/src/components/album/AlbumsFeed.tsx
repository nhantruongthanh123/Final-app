import { AlbumService } from "@/services/album.service";
import type { AlbumFeed } from "@/types/album";
import { ImageOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EmptyState from "../shared/EmptyState";
import Album from "./Album";
import AlbumModal from "./AlbumModal";

const AlbumsFeed = () => {
  const [feedAlbums, setFeedAlbums] = useState<AlbumFeed[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<AlbumFeed | null>(null);
  const navigate = useNavigate();

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
        const AlbumsData = await AlbumService.getFeedAlbums();
        setFeedAlbums(AlbumsData.feed);
      };

      fetchAlbums();
    } catch (error) {
      console.error("Error fetching Albums:", error);
    }
  }, []);

  if (feedAlbums.length === 0) {
    return (
      <EmptyState
        icon={<ImageOff className="w-10 h-10 text-orange-400" />}
        title="No albums to show"
        description="There are no albums available in your feed at the moment. Follow more users to see their albums here."
        actionLabel="Move to discover"
        onAction={() => navigate("/discover")}
      />
    );
  }

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

export default AlbumsFeed;
