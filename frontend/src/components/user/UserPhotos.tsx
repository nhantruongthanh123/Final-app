import PhotoUser from "@/components/photo/PhotoUser";
import { UserService } from "@/services/userService";
import { useAuthStore } from "@/store/authStore";
import type { Photo } from "@/types/photo";
import { useState, useEffect } from "react";

const UserPhotos = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const user = useAuthStore((state) => state.user);

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
    return <div>No photos available.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {photos.map((photo) => (
        <PhotoUser key={photo.id} photo={photo} />
      ))}
    </div>
  );
};

export default UserPhotos;
