import React from "react";
import { Heart } from "lucide-react";

const Photo = ({ imgURL }: { imgURL: string }) => {
  return (
    <div className="m-2 bg-gray-100 grid grid-cols-2">
      <div className="relative m-2">
        <img src={imgURL} alt="Photo" className="w-full h-full object-cover" />
      </div>

      <div className="flex flex-col">
        <div className="pt-4 pb-2 pl-2 font-bold flex flex-row gap-2 items-center justify-between">
          <div className="flex flex-row gap-4">
            <div className="h-8 w-8 rounded-full bg-indigo-800 flex items-center justify-center text-white">
              {" "}
              TN{" "}
            </div>
            <div className="text-indigo-800 flex items-center justify-center">
              Thanh Nhân
            </div>
          </div>
        </div>

        <div className="p-2 text-black font-bold">
          This is a sample photo title.
        </div>

        <div className="p-2 text-gray-600">
          This is sample photo description. Lorem ipsum dolor sit amet,
          consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
          labore et dolore magna
        </div>

        <div className="p-2 text-gray-600 flex mt-auto justify-between">
          <div>
            <Heart
              className="w-6 h-6 inline-block mr-1 mb-1 text-indigo-800"
              fill="currentColor"
            />
            123
          </div>
          <div> 4:56 pm 20/6/2026 </div>
        </div>
      </div>
    </div>
  );
};

export default Photo;
