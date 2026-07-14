import UserCard from "@/components/user/UserCard";
import { UserService } from "@/services/userService";
import { useAuthStore } from "@/store/authStore";
import type { UserWithFollowStatus } from "@/types/user";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const TargetUserFollower = () => {
  const [followers, setFollowers] = useState<UserWithFollowStatus[]>([]);
  const { id: publicUserId } = useParams<{ id: string }>();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!user) return;
    const fetchFollowers = async () => {
      try {
        const res = await UserService.getTargetUserFollowers(publicUserId);
        setFollowers(res);
      } catch (error) {
        console.error("Error fetching followers:", error);
      }
    };

    fetchFollowers();
  }, [user, publicUserId]);

  if (!followers) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4 p-2 m-2">
      {followers.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
};

export default TargetUserFollower;
