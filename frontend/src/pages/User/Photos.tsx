import MyProfileHeader from "@/components/user/MyProfileHeader";
import type { User } from "@/types/user";
import userData from "@/datas/userData";

const Photos = () => {
  const user: User = userData[0];

  return (
    <div className="flex flex-col w-full h-full">
      <div>
        <MyProfileHeader user={user} />
      </div>
    </div>
  );
};

export default Photos;
