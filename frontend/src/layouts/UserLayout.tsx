import { Outlet } from "react-router-dom";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

const UserLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-row flex-1">
        <Sidebar />
        <Outlet />
      </div>
    </div>
  );
};

export default UserLayout;
