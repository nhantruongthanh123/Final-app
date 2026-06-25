import type { AlbumData } from "@/types/album";
import { Heart } from "lucide-react";

const Album = ({ albumData }: { albumData: AlbumData }) => {
  return (
    <div className="bg-white border border-gray-200 shadow-sm grid grid-cols-1 md:grid-cols-2">
      <div className="flex items-center justify-center p-6">
        <div className="w-full h-64 relative">
          <img
            src={albumData.imgURLs[2] || albumData.imgURLs[0]} // Fallback just in case you don't have 3 images yet
            alt="Album bottom"
            className="absolute w-full h-[85%] object-cover border-[6px] border-white shadow-md -rotate-6 z-10"
          />
          <img
            src={albumData.imgURLs[1] || albumData.imgURLs[0]}
            alt="Album middle"
            className="absolute w-full h-[85%] object-cover border-[6px] border-white shadow-md rotate-3 z-20"
          />
          <img
            src={albumData.imgURLs[0]}
            alt="Album cover"
            className="absolute w-full h-[85%] object-cover border-[6px] border-white shadow-lg z-30"
          />
        </div>
      </div>

      <div className="flex flex-col p-2">
        <div className="pt-4 pb-2 pl-2 font-bold flex flex-row gap-2 items-center justify-between">
          <div className="flex flex-row gap-4">
            <div className="h-8 w-8 rounded-full bg-indigo-800 flex items-center justify-center text-white">
              {albumData.user
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")}
            </div>
            <div className="text-indigo-800 flex items-center justify-center">
              {albumData.user}
            </div>
          </div>
        </div>

        <div className="p-2 text-black text-sm font-bold truncate">
          {albumData.title}
        </div>

        <div className="text-gray-500 text-xs leading-relaxed p-2 line-clamp-3">
          {albumData.description}
        </div>

        <div className="p-2 text-gray-600 flex mt-auto justify-between">
          <div>
            {albumData.isLikedByCurrentUser ? (
              <Heart
                className="w-6 h-6 inline-block mr-1 mb-1 text-indigo-800"
                fill="currentColor"
              />
            ) : (
              <Heart className="w-6 h-6 inline-block mr-1 mb-1 text-gray-400" />
            )}
            {albumData.likes}
          </div>
          <div> {albumData.timestamp} </div>
        </div>
      </div>
    </div>
  );
};

export default Album;
