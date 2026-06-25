import { useState } from "react";

import Photo from "../components/photo/Photo";
import PhotoModal from "../components/photo/PhotoModal";
import TagToggle from "../components/TagToggle";
import mockPhotos from "../datas/photoData";
import mockAlbums from "../datas/albumData";
import type { PhotoData } from "../types/photo";
import Album from "@/components/album/Album";
import type { AlbumData } from "../types/album";
import AlbumModal from "@/components/album/AlbumModal";

function Feed() {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoData | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<AlbumData | null>(null);
  const [isPhotoView, setIsPhotoView] = useState(true);

  return (
    <div className="flex flex-col min-h-screen">
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
                <Photo photoData={photo} />
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
                <Album albumData={album} />
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
        imgURLs={selectedAlbum?.imgURLs || []}
      />

      <PhotoModal
        isOpen={selectedPhoto !== null}
        onClose={() => setSelectedPhoto(null)}
        title={selectedPhoto?.title || ""}
        description={selectedPhoto?.description || ""}
        imgURL={selectedPhoto?.imgURL || ""}
      />
    </div>
  );
}

export default Feed;
