import PhotoUser from "@/components/photo/PhotoUser";
import { UserService } from "@/service/userService";
import type { Photo } from "@/types/photo";
import type { User } from "@/types/user";
import { useState, useEffect } from "react";

const UserPhotos = ({ user }: { user: User }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const fetchedPhotos = await UserService.getAllUserPhotos(user.id);
        setPhotos(fetchedPhotos);
      } catch (error) {
        console.error("Error fetching photos:", error);
      }
    };

    fetchPhotos();
  }, [user.id]);

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
