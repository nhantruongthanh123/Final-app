import HeaderAdmin from "@/components/layout/HeaderAdmin";
import SidebarAdmin from "@/components/layout/SidebarAdmin";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <HeaderAdmin name="Super Admin" />
      <div className="flex flex-row flex-1 overflow-hidden">
        <SidebarAdmin />
        <main className="flex-1 flex flex-col overflow-y-auto relative bg-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
