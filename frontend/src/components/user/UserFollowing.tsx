import type { UserWithFollowStatus } from "@/types/user";
import UserCard from "./UserCard";
import { useEffect, useState } from "react";
import { UserService } from "@/services/userService";
import { useAuthStore } from "@/store/authStore";

const UserFollowing = () => {
  const [followings, setFollowings] = useState<UserWithFollowStatus[]>([]);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!user) return;
    const fetchFollowings = async () => {
      try {
        const res = await UserService.getAllUserFollowings();
        setFollowings(res);
      } catch (error) {
        console.error("Error fetching followings:", error);
      }
    };

    fetchFollowings();
  }, [user]);

  if (!followings) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4 p-2 m-2">
      {followings.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
};

export default UserFollowing;
