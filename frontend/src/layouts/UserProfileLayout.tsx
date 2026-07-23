import MyProfileHeader from "@/components/user/MyProfileHeader";
import { Outlet } from "react-router-dom";

const UserProfileLayout = () => {
  return (
    <div className="flex flex-col w-full h-full">
      <div>
        <MyProfileHeader />
        <Outlet />
      </div>
    </div>
  );
};

export default UserProfileLayout;
