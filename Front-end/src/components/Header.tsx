import React from "react";

const Header = ({ name }: { name: string }) => {
  return (
    <div className="bg-indigo-800 flex flex-row items-center justify-between py-2 px-8 font-bold">
      <div className="text-white flex justify-end w-[13%] mr-[2%]">
        Fotobook
      </div>

      <div className="flex justify-start w-[60%]">
        <input
          className="bg-white text-gray-700 placeholder:text-gray-400 rounded-sm px-4 py-1 w-[80%]"
          placeholder="Search photo/album..."
        />
      </div>

      <div className="flex items-center gap-8 md:mr-[5%]">
        <div className="flex flex-row items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-indigo-800">
            {name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div className="text-white">{name}</div>
        </div>

        <div className="text-white">
          <button>Log out</button>
        </div>
      </div>
    </div>
  );
};

export default Header;
