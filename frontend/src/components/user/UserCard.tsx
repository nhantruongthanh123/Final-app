import type { UserWithFollowStatus } from "@/types/user";
import { Button } from "@/components/ui/button";
import { UserService } from "@/services/userService";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const UserCard = ({ user }: { user: UserWithFollowStatus }) => {
  const [numOfPhotos, setNumOfPhotos] = useState<number>(0);
  const [numOfAlbums, setNumOfAlbums] = useState<number>(0);
  const [isFollowing, setIsFollowing] = useState(user.isFollowing);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const photos = await UserService.getAllUserPhotos(user.id);
        const albums = await UserService.getAllUserAlbums(user.id);
        setNumOfPhotos(photos.length);
        setNumOfAlbums(albums.length);
      } catch (error) {
        console.error("Error fetching user stats:", error);
      }
    };

    fetchUserStats();
  }, [user.id]);

  const handleFollowToggle = async () => {
    const previousState = isFollowing;
    setIsFollowing(!previousState);

    try {
      if (previousState) {
        await UserService.unfollowUser(user.id);
      } else {
        await UserService.followUser(user.id);
      }
    } catch (error) {
      console.error("Error toggling follow status:", error);
      setIsFollowing(previousState);
    }
  };

  return (
    <div className="flex flex-col items-center rounded-lg border-2 border-gray-300 bg-gray-50 shadow-md p-4 hover:shadow-lg transition-shadow duration-300">
      <img
        src={user.avatarUrl}
        alt={user.firstName + " " + user.lastName}
        className="w-16 h-16 rounded-full object-cover m-2"
      />
      <h3 className="text-lg font-semibold mt-2">
        {user.firstName} {user.lastName}
      </h3>
      <div className="flex flex-row gap-4 p-2">
        <div className="text-brand font-bold flex flex-col items-center">
          <div>{numOfPhotos}</div>
          <div>photos</div>
        </div>

        <div className="text-brand font-bold flex flex-col items-center">
          <div>{numOfAlbums}</div>
          <div>albums</div>
        </div>
      </div>

      <div className="inline-flex rounded-full bg-linear-to-r from-rose-400 to-orange-400 p-0.5 mt-2 transition-transform hover:scale-105 shadow-sm">
        <Button
          variant="ghost"
          className={cn(
            "h-8 px-6 rounded-full w-full transition-colors",
            isFollowing
              ? "bg-white hover:bg-slate-50"
              : "bg-linear-to-r from-rose-400 to-orange-400 hover:opacity-90",
          )}
          onClick={handleFollowToggle}
        >
          {isFollowing ? (
            <span className="bg-linear-to-r from-rose-400 to-orange-400 bg-clip-text text-transparent font-bold text-sm lowercase tracking-wide">
              Unfollow
            </span>
          ) : (
            <span className="text-white font-bold text-sm lowercase tracking-wide">
              Follow
            </span>
          )}
        </Button>
      </div>
    </div>
  );
};

export default UserCard;
