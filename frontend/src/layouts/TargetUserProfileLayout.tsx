import PublicUserProfileHeader from "@/components/user/TargetUserProfileHeader";
import { Outlet, useParams } from "react-router-dom";

const TargetUserProfileLayout = () => {
  const { id: publicUserId } = useParams<{ id: string }>();

  return (
    <div className="flex flex-col w-full h-full">
      <div>
        <PublicUserProfileHeader publicUserId={publicUserId} />
        <Outlet />
      </div>
    </div>
  );
};

export default TargetUserProfileLayout;
