import PhotoModal from "@/components/photo/PhotoModal";
import TargetPhotoUser from "@/components/photo/TargetPhotoUser";
import { UserService } from "@/services/user.service";
import { useAuthStore } from "@/store/authStore";
import type { Photo } from "@/types/photo";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const TargetUserPhotos = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const { id: publicUserId } = useParams<{ id: string }>();
  const user = useAuthStore((state) => state.user);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetchPhotos = async () => {
      try {
        const fetchedPhotos =
          await UserService.getTargetUserUserPhotos(publicUserId);
        setPhotos(fetchedPhotos);
      } catch (error) {
        console.error("Error fetching photos:", error);
      }
    };

    fetchPhotos();
  }, [user, publicUserId]);

  if (photos.length === 0) {
    return <div>No photos available.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {photos.map((photo) => (
        <TargetPhotoUser
          key={photo.id}
          photo={photo}
          handleClickPhoto={() => setSelectedPhoto(photo)}
        />
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

export default TargetUserPhotos;
