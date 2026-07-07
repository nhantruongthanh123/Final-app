import MyProfileHeader from "@/components/user/MyProfileHeader";
import type { User } from "@/types/user";
import { useState } from "react";
import UserPhotos from "@/components/user/UserPhotos";
import { useAuthStore } from "@/store/authStore";

const Photos = () => {
  const [user, setUser] = useState<User | null>(useAuthStore.getState().user);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col w-full h-full">
      <div>
        <MyProfileHeader user={user} />
        <UserPhotos user={user} />
      </div>
    </div>
  );
};

export default Photos;
