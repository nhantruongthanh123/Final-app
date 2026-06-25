import { Compass, LayoutGrid } from "lucide-react";
import { Link } from "react-router-dom";
import React from "react";

const Sidebar = () => {
  return (
    <div className="flex-col py-4 font-bold w-[15%] bg-stone-200 hidden md:flex shrink-0">
      <Link
        to="/feed"
        className="flex items-center w-full justify-start gap-2 px-2 md:px-4 py-2 text-sm text-stone-600 hover:text-stone-900 hover:bg-stone-300"
      >
        <LayoutGrid className="w-5 h-5 shrink-0" />
        <span className="text-base">Feed</span>
      </Link>

      <Link
        to="/discover"
        className="flex items-center w-full justify-start gap-2 px-2 md:px-4 py-2 text-sm text-stone-600 hover:text-stone-900 hover:bg-stone-300"
      >
        <Compass className="w-5 h-5 shrink-0" />
        <span className="text-base">Discover</span>
      </Link>
    </div>
  );
};

export default Sidebar;
