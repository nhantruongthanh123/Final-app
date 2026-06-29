import userData from "@/datas/userData";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import ProfileHeader from "../../components/admin/ProfileHeader";
import ProfileBody from "../../components/admin/ProfileBody";

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { id } = useParams();
  const user = userData.find((user) => user.id === Number(id));
  const [editedUser, setEditedUser] = useState(user);

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center gap-2">
        <Link
          to="/admin/users"
          className="text-indigo-800 hover:text-indigo-600 flex flex-row items-center gap-2"
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
