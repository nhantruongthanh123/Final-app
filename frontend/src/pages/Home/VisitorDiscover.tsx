import { useState } from "react";

import Album from "@/components/album/Album";
import AlbumModal from "@/components/album/AlbumModal";
import Photo from "@/components/photo/Photo";
import PhotoModal from "@/components/photo/PhotoModal";
import TagToggle from "@/components/shared/TagToggle";
import mockAlbums from "@/datas/albumData";
import mockPhotos from "@/datas/photoData";
import type { AlbumFeed } from "@/types/album";
import type { PhotoFeed } from "@/types/photo";

function VisitorDiscover() {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoFeed | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<AlbumFeed | null>(null);
  const [isPhotoView, setIsPhotoView] = useState(true);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-row flex-1">
        <div>
          <TagToggle isPhoto={isPhotoView} setIsPhoto={setIsPhotoView} />

          {isPhotoView ? (
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockPhotos.map((photo, index) => (
                <div
                  key={index}
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
              {mockAlbums.map((album, index) => (
                <div
                  key={index}
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
