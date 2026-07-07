import MyProfileHeader from "@/components/user/MyProfileHeader";
import type { User } from "@/types/user";
import UserAlbums from "@/components/user/UserAlbums";
import { useEffect, useState } from "react";
import { UserService } from "@/services/userService";

const Albums = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const fetchedUser = await UserService.getUserById(
          "0697e0f3-b0c0-45f6-bf58-cd50f78ee240",
        );
        setUser(fetchedUser);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col w-full h-full">
      <div>
        <MyProfileHeader user={user} />
        <UserAlbums user={user} />
      </div>
    </div>
  );
};

export default Albums;
