import React from "react";
import UserCard from "./UserCard";
import { followingUserData } from "@/datas/followingUserData";

const UserFollowing = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4 p-2 m-2">
      {followingUserData.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
};

export default UserFollowing;
