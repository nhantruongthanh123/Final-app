import Photo from "@/components/photo/Photo";
import PhotoModal from "@/components/photo/PhotoModal";
import { PhotoService } from "@/services/photoService";
import type { PhotoFeed } from "@/types/photo";
import { useEffect, useState } from "react";

const PhotosDiscover = () => {
  const [feedPhotos, setFeedPhotos] = useState<PhotoFeed[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoFeed | null>(null);

  const handlePhotoLike = (photoId: string, newIsLiked: boolean) => {
    setFeedPhotos((prevPhotos) =>
      prevPhotos.map((photo) =>
        photo.id === photoId
          ? {
              ...photo,
              isLiked: newIsLiked,
              numLikes: newIsLiked ? photo.numLikes + 1 : photo.numLikes - 1,
            }
          : photo,
      ),
    );
  };

  useEffect(() => {
    try {
      const fetchPhotos = async () => {
        const photosData = await PhotoService.getDiscoverPhotos();
        setFeedPhotos(photosData.discover);
      };

      fetchPhotos();
    } catch (error) {
      console.error("Error fetching photos:", error);
    }
  }, []);

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
      {feedPhotos.map((photo) => (
        <div
          key={photo.id}
          className="cursor-pointer transition-transform hover:scale-[1.02]"
        >
          <Photo
            photo={photo}
            handleClickPhoto={() => setSelectedPhoto(photo)}
            handleLikePhoto={handlePhotoLike}
          />
        </div>
      ))}

      <PhotoModal
        isOpen={selectedPhoto !== null}
        onClose={() => setSelectedPhoto(null)}
        title={selectedPhoto?.title || ""}
        description={selectedPhoto?.description || ""}
        photoUrl={selectedPhoto?.photoUrl || ""}
      />
    </div>
  );
};

export default PhotosDiscover;
