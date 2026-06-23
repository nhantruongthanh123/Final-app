import React from "react";

const Sidebar = () => {
  return (
    <div className="flex-col gap-2 py-4 font-bold w-[15%] bg-stone-300 hidden md:flex shrink-0">
      <button> Feed </button>
      <button> Discover </button>
    </div>
  );
};

export default Sidebar;
