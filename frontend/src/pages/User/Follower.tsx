import EmptyState from "@/components/shared/EmptyState";
import UserCard from "@/components/user/UserCard";
import { UserService } from "@/services/user.service";
import { useAuthStore } from "@/store/authStore";
import type { UserWithFollowStatus } from "@/types/user";
import { UserX } from "lucide-react";
import { useEffect, useState } from "react";

const Follower = () => {
  const [followers, setFollowers] = useState<UserWithFollowStatus[]>([]);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!user) return;
    const fetchFollowers = async () => {
      try {
        const res = await UserService.getAllUserFollowers();
        setFollowers(res);
      } catch (error) {
        console.error("Error fetching followers:", error);
      }
    };

    fetchFollowers();
  }, [user]);

  if (!followers || followers.length === 0) {
    return (
      <EmptyState
        icon={<UserX className="w-10 h-10 text-orange-400" />}
        title={"You haven't received any followers yet."}
        description={
          "You haven't received any followers yet. Start sharing your photos and engaging with the community to attract followers!"
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4 p-2 m-2">
      {followers.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
};

export default Follower;
