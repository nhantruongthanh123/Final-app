import { NotebookPen } from "lucide-react";
import type { Photo } from "@/types/photo";

const PhotoAdmin = ({ photo }: { photo: Photo }) => {
  return (
    <div className="bg-white border border-gray-200 shadow-sm m-2 rounded-md overflow-hidden relative">
      <div className="w-full h-64">
        <img
          src={photo.photoUrl}
          alt="Photo"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="absolute top-0 left-0 px-2 py-1 flex flex-row gap-2 text-white bg-gray-800 w-full">
        <div className="line-clamp-1 flex-1">{photo.title}</div>
        <div className="justify-end">
          <NotebookPen />
        </div>
      </div>
    </div>
  );
};

export default PhotoAdmin;
