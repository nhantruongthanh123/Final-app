import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Compass, LayoutGrid } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const MOBILE_QUERY = "(max-width: 767px)";

const Sidebar = () => {
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
    { to: "/feed", label: "Feed", icon: LayoutGrid },
    { to: "/discover", label: "Discover", icon: Compass },
  ];

  return (
    <div
      className={cn(
        "flex-col py-6 bg-slate-50/50 border-r border-slate-200 md:flex shrink-0 h-screen sticky top-0 z-50 dark:bg-slate-900 dark:border-slate-800 transition-all duration-200",
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
                  "bg-indigo-50 text-brand": isActive,
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

        {/* Toggle button */}
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

export default Sidebar;
