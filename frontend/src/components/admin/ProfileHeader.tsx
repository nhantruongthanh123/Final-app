import type { User } from "@/types/user";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const ProfileHeader = ({ user }: { user: User }) => {
  return (
    <div className="flex flex-row items-center justify-between border border-slate-200 rounded-lg shadow-sm p-4">
      {/* Avatar and Information */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <img
            src={
              "https://www.vietnamworks.com/hrinsider/wp-content/uploads/2023/12/anh-den-ngau-001.jpg"
            }
            alt="User Avatar"
            className="w-20 h-20 rounded-full object-cover border-2 border-slate-50"
          />
          <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 border-4 border-white rounded-full"></div>
        </div>

        <div className="flex flex-col">
          <h2 className="text-xl font-bold text-slate-800">{user?.name}</h2>
          <div>
            <Badge variant={user?.role === "Admin" ? "default" : "secondary"}>
              {user?.role}
            </Badge>
          </div>
        </div>
      </div>

      {/* Edit button */}
      <Button variant="outline" className="mx-4">
        Edit Profile
      </Button>
    </div>
  );
};

export default ProfileHeader;
