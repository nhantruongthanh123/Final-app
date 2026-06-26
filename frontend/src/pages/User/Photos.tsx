import MyProfileHeader from "@/components/user/MyProfileHeader";
import type { User } from "@/types/user";
import userData from "@/datas/userData";
import UserPhotos from "@/components/user/UserPhotos";

const Photos = () => {
  const user: User = userData[0];

  return (
    <div className="flex flex-col w-full h-full">
      <div>
        <MyProfileHeader user={user} />
        <UserPhotos />
      </div>
    </div>
  );
};

export default Photos;
