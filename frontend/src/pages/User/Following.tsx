import MyProfileHeader from "@/components/user/MyProfileHeader";
import UserFollowing from "@/components/user/UserFollowing";

const Following = () => {
  return (
    <div className="flex flex-col w-full h-full">
      <div>
        <MyProfileHeader />
        <UserFollowing />
      </div>
    </div>
  );
};

export default Following;
