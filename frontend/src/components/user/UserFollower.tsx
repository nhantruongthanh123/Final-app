import UserCard from "@/components/user/UserCard";
import { UserService } from "@/service/userService";
import type { User } from "@/types/user";
import { useEffect, useState } from "react";

const UserFollower = ({ user }: { user: User }) => {
  const [followers, setFollowers] = useState<User[]>([]);

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const res = await UserService.getAllUserFollowers(user.id);
        setFollowers(res);
      } catch (error) {
        console.error("Error fetching followers:", error);
      }
    };

    fetchFollowers();
  }, [user.id]);

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

export default UserFollower;
