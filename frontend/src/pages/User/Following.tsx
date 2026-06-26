import MyProfileHeader from "@/components/user/MyProfileHeader";
import type { User } from "@/types/user";
import userData from "@/datas/userData";
import UserFollowing from "@/components/user/UserFollowing";

const Following = () => {
  const user: User = userData[0];

  return (
    <div className="flex flex-col w-full h-full">
      <div>
        <MyProfileHeader user={user} />
        <UserFollowing />
      </div>
    </div>
  );
};

export default Following;
