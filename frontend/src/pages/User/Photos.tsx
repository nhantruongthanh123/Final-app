import PhotoUser from "@/components/photo/PhotoUser";
import EmptyState from "@/components/shared/EmptyState";
import { UserService } from "@/services/user.service";
import { useAuthStore } from "@/store/authStore";
import type { Photo } from "@/types/photo";
import { ImageOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Photos = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    const fetchPhotos = async () => {
      try {
        const fetchedPhotos = await UserService.getAllUserPhotos(user.id);
        setPhotos(fetchedPhotos);
      } catch (error) {
        console.error("Error fetching photos:", error);
      }
    };

    fetchPhotos();
  }, [user]);

  if (photos.length === 0) {
    return (
      <EmptyState
        icon={<ImageOff className="w-10 h-10 text-orange-400" />}
        title={"You haven't uploaded any photos yet."}
        description={
          "Start sharing your memories by uploading your first photo. Click the button below to get started!"
        }
        actionLabel={"Upload Photo"}
        onAction={() => {
          navigate("/photos/add");
        }}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {photos.map((photo) => (
        <PhotoUser key={photo.id} photo={photo} />
      ))}
    </div>
  );
};

export default Photos;
