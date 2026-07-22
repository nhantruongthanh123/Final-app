import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { User } from "@/types/user";
import { useNavigate } from "react-router-dom";

const ProfileHeader = ({ user }: { user: User | undefined }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-row items-center justify-between border border-slate-200 rounded-lg shadow-sm p-4">
      {/* Avatar and Information */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <img
            src={
              user?.avatarUrl ||
              "https://aui.atlassian.com/assets/aui/9.3/docs/images/avatar-person.svg"
            }
            alt="User Avatar"
            className="w-20 h-20 rounded-full object-cover border-2 border-slate-50"
          />
          <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 border-4 border-white rounded-full"></div>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">
            {`${user?.firstName} ${user?.lastName}`}
          </h2>
          <div>
            <Badge variant={user?.role === "Admin" ? "default" : "secondary"}>
              {user?.role}
            </Badge>
          </div>
        </div>
      </div>

      {/* Edit button */}
      <Button
        variant="outline"
        className="mx-4"
        onClick={() => navigate(`/admin/users/${user?.id}/edit`)}
      >
        Edit Profile
      </Button>
    </div>
  );
};

export default ProfileHeader;
