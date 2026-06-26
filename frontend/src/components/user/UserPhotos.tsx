import { mockPhotos } from "@/datas/photoData";
import PhotoUser from "../photo/PhotoUser";

const UserPhotos = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {mockPhotos.map((photo, index) => (
        <PhotoUser key={index} photo={photo} />
      ))}
    </div>
  );
};

export default UserPhotos;
