import { useEffect, useState } from "react";

import Album from "@/components/album/Album";
import AlbumModal from "@/components/album/AlbumModal";
import Photo from "@/components/photo/Photo";
import PhotoModal from "@/components/photo/PhotoModal";
import TagToggle from "@/components/shared/TagToggle";
import { AlbumService } from "@/services/album.service";
import { PhotoService } from "@/services/photo.service";
import type { AlbumFeed } from "@/types/album";
import type { PhotoFeed } from "@/types/photo";

function VisitorDiscover() {
  const [discoverPhotos, setDiscoverPhotos] = useState<PhotoFeed[]>([]);
  const [discoverAlbums, setDiscoverAlbums] = useState<AlbumFeed[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoFeed | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<AlbumFeed | null>(null);
  const [isPhotoView, setIsPhotoView] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isPhotoView) {
          const photosData = await PhotoService.getDiscoverPhotos();
          setDiscoverPhotos(photosData.discover);
        } else {
          const albumsData = await AlbumService.getDiscoverAlbums();
          setDiscoverAlbums(albumsData.discover);
        }
      } catch (error) {
        console.error("Error fetching feed data:", error);
      }
    };

    fetchData();
  }, [isPhotoView]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-row flex-1">
        <div className="flex flex-col flex-1">
          <TagToggle isPhoto={isPhotoView} setIsPhoto={setIsPhotoView} />

          {isPhotoView ? (
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              {discoverPhotos.map((photo) => (
                <div
                  key={photo.id}
                  onClick={() => setSelectedPhoto(photo)}
                  className="cursor-pointer transition-transform hover:scale-[1.02]"
                >
                  <Photo
                    photo={photo}
                    handleClickPhoto={() => setSelectedPhoto(photo)}
                    handleLikePhoto={() => {}}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              {discoverAlbums.map((album) => (
                <div
                  key={album.id}
                  onClick={() => setSelectedAlbum(album)}
                  className="cursor-pointer transition-transform hover:scale-[1.02]"
                >
                  <Album
                    album={album}
                    handleClickAlbum={() => setSelectedAlbum(album)}
                    handleLikeAlbum={() => {}}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
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

export default VisitorDiscover;
