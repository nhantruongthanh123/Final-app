import Header from "@/components/layout/Header";
import { useAuthStore } from "@/store/authStore";
import { Navigate, Outlet } from "react-router-dom";

const VisitorLayout = () => {
  const user = useAuthStore((state) => state.user);

  if (user) {
    if (user.role === "ADMIN") {
      return <Navigate to="/admin/photos" replace />;
    } else {
      return <Navigate to="/feed" replace />;
    }
  }

  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
};

export default VisitorLayout;
