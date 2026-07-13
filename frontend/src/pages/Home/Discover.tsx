import { useEffect, useState } from "react";

import Album from "@/components/album/Album";
import AlbumModal from "@/components/album/AlbumModal";
import Photo from "@/components/photo/Photo";
import PhotoModal from "@/components/photo/PhotoModal";
import TagToggle from "@/components/shared/TagToggle";
import { AlbumService } from "@/services/albumService";
import { PhotoService } from "@/services/photoService";
import type { AlbumFeed } from "@/types/album";
import type { PhotoFeed } from "@/types/photo";

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
            {discoverPhotos.map((photo) => (
              <div
                key={photo.id}
                className="cursor-pointer transition-transform hover:scale-[1.02]"
              >
                <Photo
                  photo={photo}
                  handleClickPhoto={() => setSelectedPhoto(photo)}
                  // handleLikePhoto={() => {}}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            {discoverAlbums.map((album) => (
              <div
                key={album.id}
                className="cursor-pointer transition-transform hover:scale-[1.02]"
              >
                <Album
                  album={album}
                  handleClickAlbum={() => setSelectedAlbum(album)}
                  // handleLikeAlbum={() => {}}
                />
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
