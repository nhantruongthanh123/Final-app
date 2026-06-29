const Header = ({ name }: { name?: string }) => {
  return (
    <div className="bg-indigo-800 flex flex-row items-center justify-between py-2 font-bold sticky top-0 z-50">
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
          <div className="flex flex-row items-center gap-4">
            <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-white flex items-center justify-center text-indigo-800">
              {name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div className="text-white hidden md:block">{name}</div>
          </div>

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
