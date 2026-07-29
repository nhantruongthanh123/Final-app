import { useFollowUser } from "@/hooks/user/useFollowUser";
import { UserService } from "@/services/user.service";
import { useAuthStore } from "@/store/authStore";
import type { UserWithFollowStatus } from "@/types/user";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FollowButton from "../shared/FollowButton";

const UserCard = ({ user }: { user: UserWithFollowStatus }) => {
  const [numOfPhotos, setNumOfPhotos] = useState<number>(0);
  const [numOfAlbums, setNumOfAlbums] = useState<number>(0);
  const [isFollowing, setIsFollowing] = useState(user.isFollowing);
  const navigate = useNavigate();
  const currentUser = useAuthStore.getState().user;
  const isCurrentUser = currentUser?.id === user.id;
  const followMutation = useFollowUser();

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const photos = await UserService.getAllUserPhotos(user.id);
        const albums = await UserService.getAllUserAlbums(user.id);
        setNumOfPhotos(photos.totalPhotos);
        setNumOfAlbums(albums.totalAlbums);
      } catch (error) {
        console.error("Error fetching user stats:", error);
      }
    };

    fetchUserStats();
  }, [user.id]);

  const handleFollowToggle = async () => {
    followMutation.mutate({
      userId: user.id,
      isCurrentlyFollowing: isFollowing,
    });

    const previousState = isFollowing;
    setIsFollowing(!previousState);
  };

  return (
    <div className="flex flex-col items-center rounded-lg border-2 border-gray-300 bg-gray-50 dark:bg-gray-800 shadow-md p-4 hover:shadow-lg transition-shadow duration-300">
      <div
        onClick={() => navigate(`/users/${user.id}/photos`)}
        className="cursor-pointer flex flex-col items-center"
      >
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.firstName + " " + user.lastName}
            className="w-16 h-16 m-2 rounded-full object-cover "
          />
        ) : (
          <div className="w-16 h-16 m-2 rounded-full bg-indigo-800  flex items-center justify-center text-white font-bold text-2xl shadow-sm">
            {user.firstName[0]}
            {user.lastName[0]}
          </div>
        )}

        <h3 className="text-lg font-semibold mt-2">
          {user.firstName} {user.lastName}
        </h3>
      </div>
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

      <FollowButton
        isCurrentUser={isCurrentUser}
        isFollowing={isFollowing}
        handleFollowToggle={handleFollowToggle}
      />
    </div>
  );
};

export default UserCard;
