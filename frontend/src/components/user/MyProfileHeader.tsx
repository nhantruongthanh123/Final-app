import { Button } from "@/components/ui/button";
import { UserService } from "@/services/userService";
import { useAuthStore } from "@/store/authStore";
import type { User, UserStatType } from "@/types/user";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import UserStat from "./UserStat";

const MyProfileHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const activeTab = location.pathname.split("/")[1] || "photos";
  const user = useAuthStore((state) => state.user) as User;
  const [numUserPhotos, setNumUserPhotos] = useState<number>(0);
  const [numUserAlbums, setNumUserAlbums] = useState<number>(0);
  const [numUserFollowings, setNumUserFollowings] = useState<number>(0);
  const [numUserFollowers, setNumUserFollowers] = useState<number>(0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const photos = await UserService.getAllUserPhotos(user.id);
        setNumUserPhotos(photos.length);

        const albums = await UserService.getAllUserAlbums(user.id);
        setNumUserAlbums(albums.length);

        const followings = await UserService.getAllUserFollowings();
        setNumUserFollowings(followings.length);

        const followers = await UserService.getAllUserFollowers();
        setNumUserFollowers(followers.length);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [user]);

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
          <img
            src={user.avatarUrl}
            alt="User Avatar"
            className="w-20 h-20 rounded-full object-cover border-2 border-slate-50"
          />
          <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 border-4 border-white rounded-full"></div>
        </div>

        <div className="flex flex-col ml-4">
          <h2 className="text-lg font-semibold">
            {user.firstName + " " + user.lastName}
          </h2>
          <Button
            variant="outline"
            className="mt-2"
            onClick={() => navigate("/profile")}
          >
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Row 2 on mobile: UserStat */}
      <div className="w-full mt-4 md:mt-0 md:ml-4 justify-end flex flex-col items-center md:flex-row gap-2">
        <UserStat activeTab={activeTab} stats={stats} />
        {(() => {
          switch (activeTab) {
            case "photos":
              return (
                <Button
                  variant="outline"
                  className="justify-center text-white bg-green-500 hover:bg-green-600"
                  onClick={() => navigate("/photos/add")}
                >
                  Add Photos
                </Button>
              );
            case "albums":
              return (
                <Button
                  variant="outline"
                  className="justify-center text-white bg-green-500 hover:bg-green-600"
                  onClick={() => navigate("/albums/add")}
                >
                  Add Albums
                </Button>
              );
            default:
              return null;
          }
        })()}
      </div>
    </div>
  );
};

export default MyProfileHeader;
