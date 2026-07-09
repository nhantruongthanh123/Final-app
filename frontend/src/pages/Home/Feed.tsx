import { useState, useEffect } from "react";

import Photo from "@/components/photo/Photo";
import PhotoModal from "@/components/photo/PhotoModal";
import TagToggle from "@/components/shared/TagToggle";
import type { PhotoFeed } from "@/types/photo";
import Album from "@/components/album/Album";
import type { AlbumFeed } from "@/types/album";
import AlbumModal from "@/components/album/AlbumModal";
import { PhotoService } from "@/services/photoService";
import { AlbumService } from "@/services/albumService";

function Feed() {
  const [feedPhotos, setFeedPhotos] = useState<PhotoFeed[]>([]);
  const [feedAlbums, setFeedAlbums] = useState<AlbumFeed[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoFeed | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<AlbumFeed | null>(null);
  const [isPhotoView, setIsPhotoView] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const photosData = await PhotoService.getFeedPhotos();
        const albumsData = await AlbumService.getFeedPhotos();
        setFeedPhotos(photosData.feed);
        setFeedAlbums(albumsData.feed);
      } catch (error) {
        console.error("Error fetching feed data:", error);
      }
    };

    fetchData();
  }, []);

  if (!feedPhotos || !feedAlbums) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-900 text-white">
        Loading feed data...
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div>
        <TagToggle isPhoto={isPhotoView} setIsPhoto={setIsPhotoView} />

        {isPhotoView ? (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            {feedPhotos.map((photo) => (
              <div
                key={photo.id}
                onClick={() => setSelectedPhoto(photo)}
                className="cursor-pointer transition-transform hover:scale-[1.02]"
              >
                <Photo photo={photo} />
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            {feedAlbums.map((album) => (
              <div
                key={album.id}
                onClick={() => setSelectedAlbum(album)}
                className="cursor-pointer transition-transform hover:scale-[1.02]"
              >
                <Album album={album} />
              </div>
            ))}
          </div>
        )}
      </div>

      <AlbumModal
        isOpen={selectedAlbum !== null}
        onClose={() => setSelectedAlbum(null)}
        title={selectedAlbum?.title || ""}
        description={selectedAlbum?.description || ""}
        photos={selectedAlbum?.photos || []}
      />

      <PhotoModal
        isOpen={selectedPhoto !== null}
        onClose={() => setSelectedPhoto(null)}
        title={selectedPhoto?.title || ""}
        description={selectedPhoto?.description || ""}
        photoUrl={selectedPhoto?.photoUrl || ""}
      />
    </div>
  );
}

export default Feed;
