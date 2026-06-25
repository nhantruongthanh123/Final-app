import React from "react";
import type { AlbumData } from "../types/album";
import { NotebookPen } from "lucide-react";

const AlbumAdmin = ({ albumData }: { albumData: AlbumData }) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const totalPages = 15;

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden mx-2">
      <div className="flex items-center justify-center pt-12 relative">
        <div className="absolute top-0 left-0 px-2 py-1 flex flex-row gap-2 text-white bg-gray-800 z-40">
          <div className="line-clamp-1">{albumData.description}</div>
          <div>
            <NotebookPen />
          </div>
        </div>

        <div className="w-64 h-64 relative">
          <img
            src={albumData.imgURLs[2] || albumData.imgURLs[0]}
            alt="Album bottom"
            className="absolute w-full h-[85%] object-cover border-[6px] border-white shadow-md -rotate-10 z-10"
          />
          <img
            src={albumData.imgURLs[1] || albumData.imgURLs[0]}
            alt="Album middle"
            className="absolute w-full h-[85%] object-cover border-[6px] border-white shadow-md rotate-5 z-20"
          />
          <img
            src={albumData.imgURLs[0]}
            alt="Album cover"
            className="absolute w-full h-[85%] object-cover border-[6px] border-white shadow-lg z-30"
          />
        </div>
      </div>
    </div>
  );
};

export default AlbumAdmin;
