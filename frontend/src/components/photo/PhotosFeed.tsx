import Photo from "@/components/photo/Photo";
import PhotoModal from "@/components/photo/PhotoModal";
import { PhotoService } from "@/services/photoService";
import type { PhotoFeed } from "@/types/photo";
import { ImageOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EmptyState from "../shared/EmptyState";

const PhotosFeed = () => {
  const [feedPhotos, setFeedPhotos] = useState<PhotoFeed[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoFeed | null>(null);
  const navigate = useNavigate();

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
        const photosData = await PhotoService.getFeedPhotos();
        setFeedPhotos(photosData.feed);
      };

      fetchPhotos();
    } catch (error) {
      console.error("Error fetching photos:", error);
    }
  }, []);

  if (feedPhotos.length === 0) {
    return (
      <EmptyState
        icon={<ImageOff className="w-10 h-10 text-orange-400" />}
        title="No photos to show"
        description="There are no photos available in your feed at the moment. Follow more users to see their photos here."
        actionLabel="Move to discover"
        onAction={() => navigate("/discover")}
      />
    );
  }

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

export default PhotosFeed;
