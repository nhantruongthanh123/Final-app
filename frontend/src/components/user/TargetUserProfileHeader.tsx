import { cn } from "@/lib/utils";
import { UserService } from "@/services/user.service";
import { useAuthStore } from "@/store/authStore";
import type { User, UserStatType, UserWithFollowStatus } from "@/types/user";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import TargetUserStat from "./TargetUserStat";

const TargetUserProfileHeader = ({
  publicUserId,
}: {
  publicUserId: string;
}) => {
  const location = useLocation();
  const activeTab = location.pathname.split("/")[3] || "photos";

  const user = useAuthStore((state) => state.user) as User;
  const navigate = useNavigate();

  const [numUserPhotos, setNumUserPhotos] = useState<number>(0);
  const [numUserAlbums, setNumUserAlbums] = useState<number>(0);
  const [numUserFollowings, setNumUserFollowings] = useState<number>(0);
  const [numUserFollowers, setNumUserFollowers] = useState<number>(0);
  const [targetUser, setTargetUser] = useState<UserWithFollowStatus | null>(
    null,
  );
  const [isFollowing, setIsFollowing] = useState(false);

  if (!publicUserId || publicUserId === user?.id) {
    navigate("/photos");
  }

  const handleFollowToggle = async () => {
    setIsFollowing(!isFollowing);
    if (!targetUser) return;

    try {
      if (isFollowing) {
        await UserService.unfollowUser(targetUser.id);
      } else {
        await UserService.followUser(targetUser.id);
      }
    } catch (error) {
      console.error("Error toggling follow status:", error);
      setIsFollowing(!isFollowing);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const photos = await UserService.getAllUserPhotos(publicUserId);
        setNumUserPhotos(photos.photos.length);
        const albums = await UserService.getAllUserAlbums(publicUserId);
        setNumUserAlbums(albums.albums.length);
        const followings = await UserService.getAllUserFollowings(publicUserId);
        setNumUserFollowings(followings.totalFollowings);
        const followers = await UserService.getAllUserFollowers(publicUserId);
        setNumUserFollowers(followers.totalFollowers);
        const userData = await UserService.getUserById(publicUserId);
        setTargetUser(userData);
        setIsFollowing(userData.isFollowing);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [publicUserId, isFollowing]);

  const stats: UserStatType[] = [
    { id: "photos", count: numUserPhotos, label: "PHOTOS" },
    { id: "albums", count: numUserAlbums, label: "ALBUMS" },
    { id: "followings", count: numUserFollowings, label: "FOLLOWINGS" },
    { id: "followers", count: numUserFollowers, label: "FOLLOWERS" },
  ];

  return (
    <div className="flex flex-col md:flex-row items-center border border-slate-200 rounded-lg shadow-sm p-4 m-4">
      {/* Row 1 on mobile: avatar + username + edit button */}
      <div className="flex flex-row items-center w-full ">
        <div className="relative">
          {targetUser?.avatarUrl ? (
            <img
              src={targetUser.avatarUrl}
              alt={targetUser.firstName}
              className="h-20 w-20 rounded-full object-cover"
            />
          ) : (
            <div className="h-20 w-20 rounded-full bg-indigo-800 flex items-center justify-center text-white text-3xl font-bold ">
              {targetUser?.firstName[0]}
              {targetUser?.lastName[0]}
            </div>
          )}
          <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 border-4 border-white rounded-full"></div>
        </div>

        <div className="flex flex-col ml-4">
          <h2 className="text-lg font-semibold">
            {targetUser?.firstName + " " + targetUser?.lastName}
          </h2>

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
                <span className="bg-linear-to-r from-rose-400 to-orange-400 bg-clip-text text-transparent font-bold text-sm tracking-wide">
                  Unfollow
                </span>
              ) : (
                <span className="text-white font-bold text-sm tracking-wide">
                  Follow
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Row 2 on mobile: UserStat */}
      <div className="w-full mt-4 md:mt-0 md:ml-4 justify-end flex flex-col items-center md:flex-row gap-2">
        <TargetUserStat activeTab={activeTab} stats={stats} />
      </div>
    </div>
  );
};

export default TargetUserProfileHeader;
