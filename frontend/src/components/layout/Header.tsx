import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/contexts/ThemeContext";
import { AuthService } from "@/services/auth.service";
import { useAuthStore } from "@/store/authStore";
import { LogOut, Moon, Settings, ShieldAlert, Sun, User } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Header = () => {
  const [searchInput, setSearchInput] = useState("");
  const { toggleTheme } = useTheme();
  const user = useAuthStore.getState().user;
  const navigate = useNavigate();
  const location = useLocation();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const params = new URLSearchParams(location.search);

      if (searchInput.trim()) {
        params.set("search", searchInput.trim());
      } else {
        params.delete("search");
      }

      const allowedPaths = ["/feed", "/discover"];
      const currentPath = location.pathname;

      const targetPath = allowedPaths.includes(currentPath)
        ? currentPath
        : "/feed";

      navigate(`${targetPath}?${params.toString()}`);
    }
  };

  const handleLogout = async () => {
    await AuthService.logout();
    await useAuthStore.getState().clearAuth();
    navigate("/");
  };

  return (
    <div className="bg-brand flex flex-row items-center justify-between py-2 font-bold sticky top-0 z-50">
      <div
        className="text-white flex justify-center w-[20%] md:w-[15%] shrink-0 md text-sm md:text-base"
        onClick={() => navigate("/")}
      >
        Fotobook
      </div>

      <div className="flex flex-1 justify-start w-[55%] mr-2 md:w-[60%] md:mr-0 ">
        <input
          className="bg-white text-gray-700 placeholder:text-gray-400 rounded-sm px-2 md:px-4 py-1 w-[90%] md:w-[80%] text-xs md:text-base dark:bg-slate-800 dark:text-slate-300 dark:placeholder:text-slate-500"
          placeholder="Search photo/album..."
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="nope"
        />
      </div>

      {user ? (
        <div className="flex items-center gap-2 md:gap-8 md:mr-[5%]">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex flex-row items-center gap-4 hover:opacity-80 transition-opacity outline-none">
              <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-white flex items-center justify-center text-brand">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.firstName}
                    className="h-8 w-8 md:h-10 md:w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-white flex items-center justify-center text-brand">
                    {user.firstName[0]}
                    {user.lastName[0]}
                  </div>
                )}
              </div>
              <div className="text-white hidden md:block">
                {user.firstName} {user.lastName}
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-44 mt-2">
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => navigate("/photos")}
              >
                <User className="mr-2 h-4 w-4" />
                <span>My Profile</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => navigate("/profile")}
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Account Settings</span>
              </DropdownMenuItem>

              {user.role === "ADMIN" && (
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => navigate("/admin/photos")}
                >
                  <ShieldAlert className="mr-2 h-4 w-4" />
                  <span>Admin page </span>
                </DropdownMenuItem>
              )}

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="cursor-pointer"
                onClick={toggleTheme}
              >
                {/* This wrapper mimics the 'mr-2 h-4 w-4' spacing of the other icons */}
                <div className="relative mr-2 h-4 w-4 flex items-center justify-center">
                  <Sun className="absolute h-4 w-4 transition-all scale-100 rotate-0 dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-4 w-4 transition-all scale-0 rotate-90 dark:rotate-0 dark:scale-100" />
                </div>
                <span>Toggle Theme</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                className="cursor-pointer text-red-600 focus:text-red-50 focus:bg-red-50 dark:text-red-400 dark:focus:text-red-50 dark:focus:bg-red-600"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="text-white pr-4 md:mr-8 whitespace-nowrap">
            <button onClick={handleLogout}>Log out</button>
          </div>
        </div>
      ) : (
        <div
          className="text-white pr-4 md:mr-8 whitespace-nowrap"
          onClick={() => navigate("/login")}
        >
          <button>Log in</button>
        </div>
      )}
    </div>
  );
};

export default Header;
