import { Outlet } from "react-router-dom";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

const UserLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header name="Thanh Nhan" />
      <div className="flex flex-row flex-1">
        <Sidebar />
        <Outlet />
      </div>
    </div>
  );
};

export default UserLayout;
