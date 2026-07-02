import { useTheme } from "@/contexts/ThemeContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { LogOut, Moon, Settings, Sun, User } from "lucide-react";
import { Link } from "react-router-dom";

const Header = ({ name }: { name?: string }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="bg-brand flex flex-row items-center justify-between py-2 font-bold sticky top-0 z-50">
      <div className="text-white flex justify-center w-[20%] md:w-[15%] shrink-0 md text-sm md:text-base pl-2 md:pl-0">
        Fotobook Admin
      </div>

      <div className="flex flex-1 justify-start w-[55%] mr-2 md:w-[60%] md:mr-0">
        <input
          className="bg-white text-gray-700 placeholder:text-gray-400 rounded-sm px-2 md:px-4 py-1 w-[90%] md:w-[80%] text-xs md:text-base"
          placeholder="Search photo/album..."
        />
      </div>

      {name ? (
        <div className="flex items-center gap-2 md:gap-8 md:mr-[5%]">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex flex-row items-center gap-4 hover:opacity-80 transition-opacity outline-none">
              <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-white flex items-center justify-center text-brand">
                {name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div className="text-white hidden md:block">{name}</div>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-44 mt-2">
              <Link to="/photos">
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>My Profile</span>
                </DropdownMenuItem>
              </Link>

              <Link to="/profile">
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Account Settings</span>
                </DropdownMenuItem>
              </Link>

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

              <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-50 focus:bg-red-50">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="text-white pr-2 md:pr-0">
            <button>Log out</button>
          </div>
        </div>
      ) : (
        <div className="text-white pr-2 md:pr-0 md:mr-[5%]">
          <button>Log in</button>
        </div>
      )}
    </div>
  );
};

export default Header;
