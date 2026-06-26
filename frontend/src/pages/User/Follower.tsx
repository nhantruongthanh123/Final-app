import MyProfileHeader from "@/components/user/MyProfileHeader";
import type { User } from "@/types/user";
import userData from "@/datas/userData";
import UserFollower from "@/components/user/UserFollower";

const Follower = () => {
  const user: User = userData[0];

  return (
    <div className="flex flex-col w-full h-full">
      <div>
        <MyProfileHeader user={user} />
        <UserFollower />
      </div>
    </div>
  );
};

export default Follower;
