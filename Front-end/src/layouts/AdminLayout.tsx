import HeaderAdmin from "@/components/HeaderAdmin";
import SidebarAdmin from "@/components/SidebarAdmin";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div>
        <HeaderAdmin name="Super Admin" />
        <div className="flex flex-row min-h-screen">
          <SidebarAdmin />
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
