import React from "react";

const TagToggle = () => {
  return (
    <div className="flex justify-center items-center font-bold pt-4 pb-4">
      <div className="p-2 text-white bg-indigo-800 border-2 border-indigo-800">
        PHOTO
      </div>
      <div className="p-2 text-indigo-800 bg-white border-2 border-indigo-800">
        ALBUM
      </div>
    </div>
  );
};

export default TagToggle;
