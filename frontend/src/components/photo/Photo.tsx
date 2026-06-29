import { Heart } from "lucide-react";
import type { PhotoData } from "../../types/photo";

const Photo = ({ photoData }: { photoData: PhotoData }) => {
  return (
    <div className="bg-white border border-gray-200 shadow-sm grid grid-cols-1 sm:grid-cols-2">
      <div className="w-full h-64">
        <img
          src={photoData.imgURL}
          alt="Photo"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex flex-col p-2">
        <div className="pt-4 pb-2 pl-2 font-bold flex flex-row gap-2 items-center justify-between">
          <div className="flex flex-row gap-4">
            <div className="h-8 w-8 rounded-full bg-indigo-800 flex items-center justify-center text-white">
              {photoData.user
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")}
            </div>
            <div className="text-indigo-800 flex items-center justify-center">
              {photoData.user}
            </div>
          </div>
        </div>

        <div className="p-2 text-black text-sm font-bold truncate">
          {photoData.title}
        </div>

        <div className="text-gray-500 text-xs leading-relaxed p-2 line-clamp-3">
          {photoData.description}
        </div>

        <div className="p-2 text-gray-600 flex mt-auto justify-between">
          <div>
            {photoData.isLikedByCurrentUser ? (
              <Heart
                className="w-6 h-6 inline-block mr-1 mb-1 text-indigo-800"
                fill="currentColor"
              />
            ) : (
              <Heart className="w-6 h-6 inline-block mr-1 mb-1 text-gray-400" />
            )}
            {photoData.likes}
          </div>
          <div> {photoData.timestamp} </div>
        </div>
      </div>
    </div>
  );
};

export default Photo;
