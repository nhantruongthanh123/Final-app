import { BookImage, Camera, User } from "lucide-react";
import { Link } from "react-router-dom";

const SidebarAdmin = () => {
  return (
    <div className="flex-col py-4 font-bold w-[15%] bg-stone-200 hidden md:flex shrink-0 h-full">
      <Link
        to="/admin/photos"
        className="flex items-center w-full justify-start gap-2 px-2 md:px-4 py-2 text-sm text-stone-600 hover:text-stone-900 hover:bg-stone-300"
      >
        <Camera className="w-5 h-5 shrink-0" />
        <span className="text-base">Manage Photos</span>
      </Link>

      <Link
        to="/admin/albums"
        className="flex items-center w-full justify-start gap-2 px-2 md:px-4 py-2 text-sm text-stone-600 hover:text-stone-900 hover:bg-stone-300"
      >
        <BookImage className="w-5 h-5 shrink-0" />
        <span className="text-base">Manage Albums</span>
      </Link>

      <Link
        to="/admin/users"
        className="flex items-center w-full justify-start gap-2 px-2 md:px-4 py-2 text-sm text-stone-600 hover:text-stone-900 hover:bg-stone-300"
      >
        <User className="w-5 h-5 shrink-0" />
        <span className="text-base">Manage Users</span>
      </Link>
    </div>
  );
};

export default SidebarAdmin;
