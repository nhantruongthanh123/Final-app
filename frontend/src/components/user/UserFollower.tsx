import { followerUserData } from "@/datas/followerUserData";
import UserCard from "@/components/user/UserCard";

const UserFollower = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4 p-2 m-2">
      {followerUserData.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
};

export default UserFollower;
