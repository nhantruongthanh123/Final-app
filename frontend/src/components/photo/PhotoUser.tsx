import type { PhotoData } from "@/types/photo";
import React from "react";

const PhotoUser = ({ photo }: { photo: PhotoData }) => {
  return (
    <div>
      <div className="flex flex-col group cursor-pointer">
        {/* 1. The Image Container */}
        <div className="overflow-hidden rounded-xl bg-slate-100 mb-3">
          <img
            src={photo.imgURL}
            alt={photo.title}
            className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* 2. The Text Label */}
        <p className="text-sm text-slate-600 text-center font-medium">
          {photo.title}
        </p>
      </div>
    </div>
  );
};

export default PhotoUser;
