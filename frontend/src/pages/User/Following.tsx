import EmptyState from "@/components/shared/EmptyState";
import UserCard from "@/components/user/UserCard";
import { UserService } from "@/services/user.service";
import { useAuthStore } from "@/store/authStore";
import type { UserWithFollowStatus } from "@/types/user";
import { UserX } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Following = () => {
  const [followings, setFollowings] = useState<UserWithFollowStatus[]>([]);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    const fetchFollowings = async () => {
      try {
        const res = await UserService.getAllUserFollowings();
        setFollowings(res);
      } catch (error) {
        console.error("Error fetching following:", error);
      }
    };

    fetchFollowings();
  }, [user]);

  if (!followings || followings.length === 0) {
    return (
      <EmptyState
        icon={<UserX className="w-10 h-10 text-orange-400" />}
        title={"You haven't followed anyone yet."}
        description={
          "Discover and start following other users to see their photos and updates here."
        }
        actionLabel={"Discover"}
        onAction={() => {
          navigate("/discover");
        }}
      />
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4 p-2 m-2">
      {followings.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
};

export default Following;
