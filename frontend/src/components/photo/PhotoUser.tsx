import type { PhotoData } from "@/types/photo";
import { Lock } from "lucide-react";
import { Link } from "react-router-dom";

const PhotoUser = ({ photo }: { photo: PhotoData }) => {
  return (
    <Link to={`/photos/${photo.id}`} className="w-full">
      <div className="flex flex-col group cursor-pointer ">
        {/* 1. The Image Container */}
        <div className="overflow-hidden rounded-xl bg-slate-100 mb-3 relative">
          <img
            src={photo.imgURL}
            alt={photo.title}
            className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {!photo.isPublic && (
            <Lock className="absolute top-3 right-3 text-white bg-black bg-opacity-50 p-1 rounded-full w-8 h-8" />
          )}

          <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
            Edit
          </div>
        </div>

        {/* 2. The Text Label */}
        <p className="text-sm text-slate-600 text-center font-medium">
          {photo.title}
        </p>
      </div>
    </Link>
  );
};

export default PhotoUser;
