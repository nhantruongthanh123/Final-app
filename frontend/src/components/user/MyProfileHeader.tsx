import type { User } from "@/types/user";
import { Button } from "@/components/ui/button";
import UserStat from "./UserStat";
import { useState } from "react";

const MyProfileHeader = ({ user }: { user: User }) => {
  const [activeTab, setActiveTab] = useState("photos");

  return (
    <div className="flex flex-col md:flex-row items-center border border-slate-200 rounded-lg shadow-sm p-4 m-4">
      {/* Row 1 on mobile: avatar + username + edit button */}
      <div className="flex flex-row items-center w-full ">
        <div className="relative">
          <img
            src="https://www.vietnamworks.com/hrinsider/wp-content/uploads/2023/12/anh-den-ngau-015.jpg"
            alt="User Avatar"
            className="w-20 h-20 rounded-full object-cover border-2 border-slate-50"
          />
          <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 border-4 border-white rounded-full"></div>
        </div>

        <div className="flex flex-col ml-4">
          <h2 className="text-lg font-semibold">{user.name}</h2>
          <Button variant="outline" className="mt-2">
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Row 2 on mobile: UserStat */}
      <div className="w-full mt-4 md:mt-0 md:ml-4 justify-end flex flex-col items-center md:flex-row gap-2">
        <UserStat activeTab={activeTab} setActiveTab={setActiveTab} />
        {(() => {
          switch (activeTab) {
            case "photos":
              return (
                <Button variant="outline" className="justify-center">
                  Add Photos
                </Button>
              );
            case "albums":
              return (
                <Button variant="outline" className="justify-center">
                  Add Albums
                </Button>
              );
            default:
              return null;
          }
        })()}
      </div>
    </div>
  );
};

export default MyProfileHeader;
