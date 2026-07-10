import { useEffect, useState } from "react";

import Photo from "@/components/photo/Photo";
import PhotoModal from "@/components/photo/PhotoModal";
import TagToggle from "@/components/shared/TagToggle";
import type { PhotoFeed } from "@/types/photo";
import Album from "@/components/album/Album";
import type { AlbumFeed } from "@/types/album";
import AlbumModal from "@/components/album/AlbumModal";
import { PhotoService } from "@/services/photoService";
import { AlbumService } from "@/services/albumService";

function Discover() {
  const [discoverPhotos, setDiscoverPhotos] = useState<PhotoFeed[]>([]);
  const [discoverAlbums, setDiscoverAlbums] = useState<AlbumFeed[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoFeed | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<AlbumFeed | null>(null);
  const [isPhotoView, setIsPhotoView] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [photosData, albumsData] = await Promise.all([
          PhotoService.getDiscoverPhotos(),
          AlbumService.getDiscoverAlbums(),
        ]);
        setDiscoverPhotos(photosData.discover);
        setDiscoverAlbums(albumsData.discover);
      } catch (error) {
        console.error("Error fetching feed data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <div>
        <TagToggle isPhoto={isPhotoView} setIsPhoto={setIsPhotoView} />

        {isPhotoView ? (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            {discoverPhotos.toReversed().map((photo) => (
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
            {discoverAlbums.toReversed().map((album) => (
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

export default Discover;
