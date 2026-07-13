import { UserService } from "@/services/userService";
import { useAuthStore } from "@/store/authStore";
import { formatDateTime } from "@/utils/formatDateTime";
import { Heart } from "lucide-react";
import { useState } from "react";
import type { PhotoFeed } from "../../types/photo";
import PublicUserInfo from "../shared/PublicUserInfo";

const Photo = ({
  photo,
  handleClickPhoto,
  // handleLikePhoto,
}: {
  photo: PhotoFeed;
  handleClickPhoto: () => void;
  // handleLikePhoto: (photoId: string, newIsLiked: boolean) => void;
}) => {
  const [isLiked, setIsLiked] = useState(photo.isLiked);
  const [numLikes, setNumLikes] = useState(photo.numLikes);
  const user = useAuthStore.getState().user;

  const handleLike = async () => {
    if (!user) return;

    try {
      if (isLiked) {
        await UserService.unlikePhoto(photo.id);
      } else {
        await UserService.likePhoto(photo.id);
      }
      setIsLiked(!isLiked);
      setNumLikes((prev) => (isLiked ? prev - 1 : prev + 1));
      // handleLikePhoto(photo.id, !isLiked);
    } catch (error) {
      console.error("Error liking/unliking photo:", error);
    }
  };

  return (
    <div className="bg-white border border-gray-200 shadow-sm grid grid-cols-1 sm:grid-cols-2 dark:bg-card dark:border-border">
      <div className="w-full h-64">
        <img
          src={photo.photoUrl}
          alt="Photo"
          className="w-full h-full object-cover border border-gray-200 dark:border-border"
          onClick={handleClickPhoto}
        />
      </div>

      <div className="flex flex-col p-2 ">
        <div className="pt-4 pb-2 pl-2 font-bold flex flex-row gap-2 items-center justify-between">
          <PublicUserInfo
            firstName={photo.user.firstName}
            lastName={photo.user.lastName}
            avatarUrl={photo.user.avatarUrl}
          />
        </div>

        <div className="p-2 text-black text-sm font-bold truncate dark:text-slate-50">
          {photo.title}
        </div>

        <div className="text-gray-500 text-xs leading-relaxed p-2 line-clamp-3 dark:text-slate-400">
          {photo.description}
        </div>

        <div className="p-2 text-gray-600 flex mt-auto justify-between">
          <div className="cursor-pointer" onClick={handleLike}>
            {isLiked ? (
              <Heart
                className="w-6 h-6 inline-block mr-1 mb-1 text-brand"
                fill="currentColor"
              />
            ) : (
              <Heart className="w-6 h-6 inline-block mr-1 mb-1 text-gray-400" />
            )}
            {numLikes}
          </div>
          <div className="text-gray-500 divt-xs dark:text-slate-400">
            {formatDateTime(photo.updatedAt)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Photo;
