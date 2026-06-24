import { Outlet } from "react-router-dom";
import Header from "@/components/Header";

const VisitorLayout = () => {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
};

export default VisitorLayout;
