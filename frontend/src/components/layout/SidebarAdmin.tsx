import { cn } from "@/lib/utils";
import { BookImage, LayoutGrid, User } from "lucide-react";
import { NavLink } from "react-router-dom";

const SidebarAdmin = () => {
  return (
    <div className="flex-col py-6 w-56 bg-slate-50/50 border-r border-slate-200 hidden md:flex shrink-0 h-screen sticky top-0 z-50 dark:bg-slate-900 dark:border-slate-800">
      <div className="flex flex-col gap-1 px-3 w-full">
        <NavLink
          to="/admin/photos"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-semibold transition-all",
              {
                "bg-indigo-50 text-indigo-700": isActive,
                "text-slate-600 hover:bg-slate-100 hover:text-slate-900":
                  !isActive,
              },
            )
          }
        >
          <LayoutGrid className="w-5 h-5 shrink-0" />
          <span>Manage Photos</span>
        </NavLink>

        <NavLink
          to="/admin/albums"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-semibold transition-all",
              {
                "bg-indigo-50 text-indigo-700": isActive,
                "text-slate-600 hover:bg-slate-100 hover:text-slate-900":
                  !isActive,
              },
            )
          }
        >
          <BookImage className="w-5 h-5 shrink-0" />
          <span>Manage Albums</span>
        </NavLink>

        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-semibold transition-all",
              {
                "bg-indigo-50 text-indigo-700": isActive,
                "text-slate-600 hover:bg-slate-100 hover:text-slate-900":
                  !isActive,
              },
            )
          }
        >
          <User className="w-5 h-5 shrink-0" />
          <span>Manage Users</span>
        </NavLink>
      </div>
    </div>
  );
};

export default SidebarAdmin;
