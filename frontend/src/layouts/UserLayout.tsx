import { Outlet } from "react-router-dom";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

const UserLayout = () => {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header name="Thanh Nhan" />
      <div className="flex flex-row flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex flex-col overflow-y-auto relative bg-white dark:bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
