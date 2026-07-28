import { useAuthStore } from "@/store/authStore";
import FollowButton from "./FollowButton";

const PublicUserInfo = ({
  firstName,
  lastName,
  avatarUrl,
  isFollowing,
  isCurrentUser,
  handleFollowToggle,
  handleClickUser,
}: {
  firstName: string;
  lastName: string;
  avatarUrl?: string | null;
  isFollowing: boolean;
  isCurrentUser: boolean;
  handleFollowToggle: () => void;
  handleClickUser: () => void;
}) => {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="flex flex-row gap-4 w-full">
      {avatarUrl ? (
        <div
          className="h-8 w-8 rounded-full bg-brand flex items-center justify-center text-white"
          onClick={handleClickUser}
        >
          <img
            src={avatarUrl}
            alt={firstName}
            className="h-8 w-8 rounded-full object-cover"
          />
        </div>
      ) : (
        <div
          className="h-8 w-8 rounded-full bg-brand flex items-center justify-center text-white"
          onClick={handleClickUser}
        >
          {firstName.charAt(0) + lastName.charAt(0)}{" "}
        </div>
      )}
      <div
        className="text-brand flex items-center justify-center cursor-pointer"
        onClick={handleClickUser}
      >
        {firstName} {lastName}
      </div>
      {user && (
        <div className="ml-auto flex items-center">
          <FollowButton
            isCurrentUser={isCurrentUser}
            isFollowing={isFollowing}
            handleFollowToggle={handleFollowToggle}
          />
        </div>
      )}
    </div>
  );
};

export default PublicUserInfo;
