import { UserService } from "@/services/userService";
import { useAuthStore } from "@/store/authStore";
import type { AlbumFeed } from "@/types/album";
import { formatDateTime } from "@/utils/formatDateTime";
import { Heart } from "lucide-react";
import { useState } from "react";
import PublicUserInfo from "../shared/PublicUserInfo";

const Album = ({
  album,
  handleClickAlbum,
  // handleLikeAlbum,
}: {
  album: AlbumFeed;
  handleClickAlbum: () => void;
  // handleLikeAlbum: (albumId: string, newIsLiked: boolean) => void;
}) => {
  const [isLiked, setIsLiked] = useState(album.isLiked);
  const [numLikes, setNumLikes] = useState(album.numLikes);
  const user = useAuthStore.getState().user;

  const handleLike = async () => {
    if (!user) return;

    try {
      if (isLiked) {
        await UserService.unlikeAlbum(album.id);
      } else {
        await UserService.likeAlbum(album.id);
      }
      setIsLiked(!isLiked);
      setNumLikes((prev) => (isLiked ? prev - 1 : prev + 1));
      // handleLikeAlbum(album.id, !isLiked);
    } catch (error) {
      console.error("Error liking/unliking album:", error);
    }
  };

  return (
    <div className="bg-white border border-gray-200 shadow-sm grid grid-cols-1 md:grid-cols-2 dark:bg-card dark:border-border">
      <div className="flex items-center justify-center p-6">
        <div className="w-full h-64 relative" onClick={handleClickAlbum}>
          <img
            src={album.photos[2] || album.photos[0]} // Fallback just in case you don't have 3 images yet
            alt="Album bottom"
            className="absolute w-full h-[85%] object-cover border-[6px] border-white shadow-md -rotate-6 z-10"
          />
          <img
            src={album.photos[1] || album.photos[0]}
            alt="Album middle"
            className="absolute w-full h-[85%] object-cover border-[6px] border-white shadow-md rotate-3 z-20"
          />
          <img
            src={album.photos[0]}
            alt="Album cover"
            className="absolute w-full h-[85%] object-cover border-[6px] border-white shadow-lg z-30"
          />
        </div>
      </div>

      <div className="flex flex-col p-2">
        <div className="pt-4 pb-2 pl-2 font-bold flex flex-row gap-2 items-center justify-between">
          <PublicUserInfo
            firstName={album.user.firstName}
            lastName={album.user.lastName}
            avatarUrl={album.user.avatarUrl}
          />
        </div>

        <div className="p-2 text-black text-sm font-bold truncate">
          {album.title}
        </div>

        <div className="text-gray-500 text-xs leading-relaxed p-2 line-clamp-3">
          {album.description}
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
          <div> {formatDateTime(album.updatedAt)} </div>
        </div>
      </div>
    </div>
  );
};

export default Album;
