import { NotebookPen } from "lucide-react";
import type { PhotoData } from "../../types/photo";

const PhotoAdmin = ({ photoData }: { photoData: PhotoData }) => {
  return (
    <div className="bg-white border border-gray-200 shadow-sm m-2 rounded-md overflow-hidden relative">
      <div className="w-full h-64">
        <img
          src={photoData.imgURL}
          alt="Photo"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="absolute top-0 left-0 px-2 py-1 flex flex-row gap-2 text-white bg-gray-800">
        <div className="line-clamp-1">{photoData.description}</div>
        <div>
          <NotebookPen />
        </div>
      </div>
    </div>
  );
};

export default PhotoAdmin;
