import type { AlbumData } from "@/types/album";
import { Link } from "react-router-dom";

const AlbumUser = ({ albumData }: { albumData: AlbumData }) => {
  return (
    <div className="flex items-center justify-center p-6 flex-col">
      <Link to={`/albums/${albumData.id}`} className="w-full">
        <div className="w-full h-64 relative ">
          <img
            src={albumData.imgURLs[2] || albumData.imgURLs[0]} // Fallback just in case you don't have 3 images yet
            alt="Album bottom"
            className="absolute w-full h-[90%] object-cover border-[6px] border-white shadow-md -rotate-6 z-10"
          />
          <img
            src={albumData.imgURLs[1] || albumData.imgURLs[0]}
            alt="Album middle"
            className="absolute w-full h-[90%] object-cover border-[6px] border-white shadow-md rotate-3 z-20"
          />
          <img
            src={albumData.imgURLs[0]}
            alt="Album cover"
            className="absolute w-full h-[90%] object-cover border-[6px] border-white shadow-lg z-30"
          />

          <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/60  z-40 rounded-full flex items-center justify-center w-24 h-24 md:w-30 md:h-30">
            <div className="flex flex-col items-center justify-center text-white">
              <span className="text-xl md:text-3xl font-bold leading-none drop-shadow-md">
                {albumData.imgURLs.length}
              </span>

              <span className="text-[10px] md:text-xs font-medium uppercase tracking-widest text-white/80 mt-1 drop-shadow-sm">
                Photos
              </span>
            </div>
          </div>
        </div>
      </Link>

      <p className="text-sm text-slate-600 text-center font-medium">
        {albumData.title}
      </p>
    </div>
  );
};

export default AlbumUser;
