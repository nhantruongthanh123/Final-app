import { cn } from "@/lib/utils";
import {
  BookImage,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const MOBILE_QUERY = "(max-width: 767px)";

const SidebarAdmin = () => {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(MOBILE_QUERY);

    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches) {
        setCollapsed(true);
      }
    };

    handleChange(mql);

    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  const navItems = [
    { to: "/admin/photos", label: "Manage Photos", icon: LayoutGrid },
    { to: "/admin/albums", label: "Manage Albums", icon: BookImage },
    { to: "/admin/users", label: "Manage Users", icon: User },
  ];

  return (
    <div
      className={cn(
        "flex flex-col py-6 bg-slate-50/50 border-r border-slate-200 shrink-0 h-screen sticky top-0 z-50 dark:bg-slate-900 dark:border-slate-800 transition-all duration-200",
        collapsed ? "w-16" : "w-56",
      )}
    >
      <div className="flex flex-col gap-1 px-3 w-full">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 py-2.5 rounded-lg text-base font-semibold transition-all",
                collapsed ? "px-2.5 justify-center" : "px-3",
                {
                  "bg-indigo-50 text-indigo-700": isActive,
                  "text-slate-600 hover:bg-slate-100 hover:text-slate-900":
                    !isActive,
                },
              )
            }
          >
            <Icon className="w-5 h-5 shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}

        <button
          type="button"
          onClick={() => setCollapsed((prev) => !prev)}
          className={cn(
            "flex items-center gap-3 py-2.5 rounded-lg text-base font-semibold transition-all",
            collapsed ? "px-2.5 justify-center" : "px-3",
            "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
          )}
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5 shrink-0" />
          ) : (
            <ChevronLeft className="w-5 h-5 shrink-0" />
          )}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </div>
  );
};

export default SidebarAdmin;
