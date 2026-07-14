import type { Photo } from "@/types/photo";

const TargetPhotoUser = ({
  photo,
  handleClickPhoto,
}: {
  photo: Photo;
  handleClickPhoto: () => void;
}) => {
  return (
    <div
      className="flex flex-col group cursor-pointer "
      onClick={handleClickPhoto}
    >
      {/* 1. The Image Container */}
      <div className="overflow-hidden rounded-xl bg-slate-100 mb-3 relative">
        <img
          src={photo.photoUrl}
          alt={photo.title}
          className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* {!photo.isPublic && (
            <Lock className="absolute top-3 right-3 text-white bg-black bg-opacity-50 p-1 rounded-full w-8 h-8" />
          )} */}
      </div>

      {/* 2. The Text Label */}
      <p className="text-sm text-slate-600 text-center font-medium">
        {photo.title}
      </p>
    </div>
  );
};

export default TargetPhotoUser;
