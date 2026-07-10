import HeaderAdmin from "@/components/layout/HeaderAdmin";
import SidebarAdmin from "@/components/layout/SidebarAdmin";
import { useAuthStore } from "@/store/authStore";
import { Navigate, Outlet } from "react-router-dom";

const AdminLayout = () => {
  const user = useAuthStore((state) => state.user);

  if (!user || user.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <HeaderAdmin />
      <div className="flex flex-row flex-1 overflow-hidden">
        <SidebarAdmin />
        <main className="flex-1 flex flex-col overflow-y-auto relative bg-white dark:bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
