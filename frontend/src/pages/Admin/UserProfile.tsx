import ProfileBody from "@/components/admin/ProfileBody";
import ProfileHeader from "@/components/admin/ProfileHeader";
import { UserService } from "@/services/user.service";
import type { User } from "@/types/user";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";

const UserProfile = () => {
  const { id } = useParams() || "";
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await UserService.getUserById(id);
        setUser(user);
      } catch (error) {
        console.error("Error fetching user:", error);
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          toast.error("User not found");
        }
      }
    };

    fetchUser();
  }, [id]);

  if (!id || !user) {
    return (
      <div className="flex-1 flex flex-col p-6 max-w-7xl mx-auto w-full">
        <p className="text-slate-500 text-sm mt-1"> {user?.email}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center gap-2">
        <Link
          to="/admin/users"
          className="text-brand hover:text-indigo-600 flex flex-row items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-xl font-bold">User Profile</span>
        </Link>
      </div>

      <ProfileHeader user={user} />
      <ProfileBody user={user} />
    </div>
  );
};

export default UserProfile;
